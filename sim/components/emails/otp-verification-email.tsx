import * as React from 'react'
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { baseStyles } from './base-styles'

interface OTPVerificationEmailProps {
  otp: string
  email?: string
  type?: 'sign-in' | 'email-verification' | 'forget-password'
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://simstudio.ai'

const getSubjectByType = (type: string) => {
  switch (type) {
    case 'sign-in':
      return 'Sign in to Sim Studio'
    case 'email-verification':
      return 'Verify your email for Sim Studio'
    case 'forget-password':
      return 'Reset your Sim Studio password'
    default:
      return 'Verification code for Sim Studio'
  }
}

export const OTPVerificationEmail = ({
  otp,
  email = '',
  type = 'email-verification',
}: OTPVerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={baseStyles.main}>
        <Preview>{getSubjectByType(type)}</Preview>
        <Container style={baseStyles.container}>
          <Section style={{ ...baseStyles.header, textAlign: 'center' }}>
            <Img
              src={`${baseUrl}/sim.png`}
              width="120"
              height="40"
              alt="Sim Studio"
              style={{
                display: 'block',
                objectFit: 'contain',
                margin: '0 auto',
              }}
            />
          </Section>
          <Section style={baseStyles.sectionsBorders}>
            <Row>
              <Column style={baseStyles.sectionBorder} />
              <Column style={baseStyles.sectionCenter} />
              <Column style={baseStyles.sectionBorder} />
            </Row>
          </Section>
          <Section style={baseStyles.content}>
            <Text style={baseStyles.paragraph}>
              {type === 'sign-in'
                ? 'Sign in to'
                : type === 'forget-password'
                  ? 'Reset your password for'
                  : 'Welcome to'}{' '}
              Sim Studio!
            </Text>
            <Text style={baseStyles.paragraph}>Your verification code is:</Text>
            <Section style={baseStyles.codeContainer}>
              <Text style={baseStyles.code}>{otp}</Text>
            </Section>
            <Text style={baseStyles.paragraph}>This code will expire in 15 minutes.</Text>
            <Text style={baseStyles.paragraph}>
              If you didn't request this code, you can safely ignore this email.
            </Text>
            <Text style={baseStyles.paragraph}>
              Best regards,
              <br />
              The Sim Studio Team
            </Text>
          </Section>
        </Container>

        <Section style={baseStyles.footer}>
          <table width="100%" border={0} cellPadding={0} cellSpacing={0} role="presentation">
            <tr>
              <td align="center" style={{ padding: '10px 0' }}>
                <Link
                  href="https://x.com/simstudioai"
                  style={{ textDecoration: 'none', margin: '0 8px', display: 'inline-block' }}
                >
                  <Img
                    src={`${baseUrl}/x-icon.png`}
                    width="24"
                    height="24"
                    alt="X"
                    style={{ display: 'block' }}
                  />
                </Link>
                <Link
                  href="https://discord.gg/crdsGfGk"
                  style={{ textDecoration: 'none', margin: '0 8px', display: 'inline-block' }}
                >
                  <Img
                    src={`${baseUrl}/discord-icon.png`}
                    width="24"
                    height="24"
                    alt="Discord"
                    style={{ display: 'block' }}
                  />
                </Link>
              </td>
            </tr>
          </table>
          <Text style={baseStyles.footerText}>
            © {new Date().getFullYear()} Sim Studio, All Rights Reserved
            <br />
            If you have any questions, please contact us at support@simstudio.ai
          </Text>
        </Section>
      </Body>
    </Html>
  )
}

export default OTPVerificationEmail
