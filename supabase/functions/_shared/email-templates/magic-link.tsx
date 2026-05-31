/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

const BRAND = 'Meine Traum Webseite'

export const MagicLinkEmail = ({
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Dein Login-Link für {BRAND}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={brand}>{BRAND}</Heading>
        <Heading style={h1}>Dein Login-Link</Heading>
        <Text style={text}>
          Klicke auf den Button, um dich sicher in dein Kundenportal einzuloggen.
          Der Link ist nur kurze Zeit gültig.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Jetzt einloggen
        </Button>
        <Text style={footer}>
          Du hast diesen Link nicht angefordert? Dann kannst du diese E-Mail
          einfach ignorieren.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Helvetica, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brand = {
  fontSize: '14px',
  fontWeight: '700' as const,
  color: 'hsl(250, 56%, 48%)',
  letterSpacing: '0.5px',
  margin: '0 0 24px',
  textTransform: 'uppercase' as const,
}
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#1E1B4B',
  margin: '0 0 16px',
}
const text = {
  fontSize: '15px',
  color: '#55575d',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const button = {
  backgroundColor: 'hsl(250, 56%, 48%)',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '12px',
  padding: '14px 28px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '32px 0 0' }
