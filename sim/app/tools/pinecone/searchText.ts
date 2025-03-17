import { ToolConfig } from '../types'
import { PineconeResponse, PineconeSearchHit, PineconeSearchTextParams } from './types'

export const searchTextTool: ToolConfig<PineconeSearchTextParams, PineconeResponse> = {
  id: 'pinecone_search_text',
  name: 'Pinecone Search Text',
  description: 'Search for similar text in a Pinecone index',
  version: '1.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      requiredForToolCall: true,
      description: 'Pinecone API key',
    },
    indexHost: {
      type: 'string',
      required: true,
      requiredForToolCall: true,
      description: 'Full Pinecone index host URL',
    },
    namespace: {
      type: 'string',
      required: false,
      description: 'Namespace to search in',
    },
    searchQuery: {
      type: 'string',
      required: true,
      description: 'Text to search for',
    },
    topK: {
      type: 'string',
      required: false,
      description: 'Number of results to return',
    },
    fields: {
      type: 'array',
      required: false,
      description: 'Fields to return in the results',
    },
    filter: {
      type: 'object',
      required: false,
      description: 'Filter to apply to the search',
    },
    rerank: {
      type: 'object',
      required: false,
      description: 'Reranking parameters',
    },
  },

  request: {
    method: 'POST',
    url: (params) => `${params.indexHost}/records/namespaces/${params.namespace}/search`,
    headers: (params) => ({
      'Api-Key': params.apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Pinecone-API-Version': '2025-01',
    }),
    body: (params) => {
      // Format the query object
      const query = {
        inputs: { text: params.searchQuery },
        top_k: parseInt(params.topK || '10'),
      }

      // Build the request body
      const body: any = {
        query,
      }

      // Add optional parameters if provided
      if (params.fields) {
        body.fields = typeof params.fields === 'string' ? JSON.parse(params.fields) : params.fields
      }

      if (params.filter) {
        body.query.filter =
          typeof params.filter === 'string' ? JSON.parse(params.filter) : params.filter
      }

      if (params.rerank) {
        body.rerank = typeof params.rerank === 'string' ? JSON.parse(params.rerank) : params.rerank
        // If rerank query is not specified, use the search query
        if (!body.rerank.query) {
          body.rerank.query = { text: params.searchQuery }
        }
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        matches: data.result.hits.map((hit: PineconeSearchHit) => ({
          id: hit._id,
          score: hit._score,
          metadata: hit.fields,
        })),
        usage: {
          total_tokens: data.usage.embed_total_tokens || 0,
          read_units: data.usage.read_units,
          rerank_units: data.usage.rerank_units,
        },
      },
    }
  },

  transformError: (error) => `Pinecone text search failed: ${error.message}`,
}
