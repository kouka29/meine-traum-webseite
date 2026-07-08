/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  code?: string
  firstName?: string
  expiresInMinutes?: number
}

const InvoiceCodeEmail = ({ code = '000000', firstName, expiresInMinutes = 15 }: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Ihr Bestätigungscode für die Rechnungsbestellung: {code}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Bestellung auf Rechnung bestätigen</Heading>
        <Text style={text}>
          {firstName ? `Hallo ${firstName},` : 'Hallo,'}
        </Text>
        <Text style={text}>
          um Ihre verbindliche Bestellung auf Rechnungsbasis abzuschließen,
          geben Sie bitte den folgenden Bestätigungscode im Checkout ein:
        </Text>
        <Section style={codeBox}>
          <Text style={codeText}>{code}</Text>
        </Section>
        <Text style={meta}>
          Der Code ist {expiresInMinutes} Minuten gültig. Falls Sie diese
          Bestellung nicht ausgelöst haben, ignorieren Sie diese E-Mail —
          es entsteht keine Verpflichtung.
        </Text>
        <Text style={footer}>
          Meine Traum Webseite · Automatisch generierte Nachricht
        </Text>
      </Container>
    </Body>
  </Html>
)

const main: React.CSSProperties = { backgroundColor: '#f6f6fb', fontFamily: 'Inter, Arial, sans-serif', padding: '24px 0' }
const container: React.CSSProperties = { maxWidth: 560, margin: '0 auto', background: '#fff', borderRadius: 12, padding: '32px' }
const h1: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#1E1B4B', margin: '0 0 16px' }
const text: React.CSSProperties = { fontSize: 15, color: '#334155', lineHeight: 1.6, margin: '0 0 12px' }
const codeBox: React.CSSProperties = { background: '#F5F4FF', border: '1px solid #E5E3FF', borderRadius: 12, padding: '20px', textAlign: 'center', margin: '20px 0' }
const codeText: React.CSSProperties = { fontSize: 34, fontWeight: 800, letterSpacing: '0.4em', color: '#4F3FF0', margin: 0, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }
const meta: React.CSSProperties = { fontSize: 12, color: '#6B7280', lineHeight: 1.5, margin: '16px 0 0' }
const footer: React.CSSProperties = { fontSize: 11, color: '#9CA3AF', marginTop: 24 }

export const template: TemplateEntry = {
  component: InvoiceCodeEmail,
  subject: (data) => `Ihr Bestätigungscode: ${data?.code ?? ''}`.trim(),
  displayName: 'Rechnungsbestellung – Bestätigungscode',
  previewData: { code: '482913', firstName: 'Max', expiresInMinutes: 15 },
}
