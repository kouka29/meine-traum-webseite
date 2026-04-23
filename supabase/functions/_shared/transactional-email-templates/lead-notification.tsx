/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Meine Traum-Webseite'

interface LeadNotificationProps {
  source?: string
  firstName?: string
  companyName?: string
  email?: string
  phone?: string
  website?: string
  message?: string
  submittedAt?: string
  bookingDate?: string
  bookingTime?: string
  contactMethod?: string
}

const LeadNotificationEmail = ({
  source,
  firstName,
  companyName,
  email,
  phone,
  website,
  message,
  submittedAt,
  bookingDate,
  bookingTime,
  contactMethod,
}: LeadNotificationProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>
      Neuer Lead{firstName ? ` von ${firstName}` : ''}
      {companyName ? ` (${companyName})` : ''}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerBar}>
          <Heading style={h1}>🎯 Neuer Lead eingegangen</Heading>
          <Text style={subtitle}>
            {source ? `Quelle: ${source}` : 'Eine neue Anfrage über deine Website'}
          </Text>
        </Section>

        <Section style={card}>
          {firstName && (
            <Row label="Name" value={firstName} />
          )}
          {companyName && (
            <Row label="Firma" value={companyName} />
          )}
          {email && (
            <Row label="E-Mail" value={email} />
          )}
          {phone && (
            <Row label="Telefon" value={phone} />
          )}
          {website && (
            <Row label="Website" value={website} />
          )}
          {message && (
            <>
              <Hr style={hr} />
              <Text style={labelLarge}>Nachricht / Problem</Text>
              <Text style={messageBox}>{message}</Text>
            </>
          )}
        </Section>

        {(bookingDate || bookingTime || contactMethod) && (
          <Section style={bookingCard}>
            <Text style={bookingHeader}>📅 Termin gebucht</Text>
            {bookingDate && <Row label="Datum" value={bookingDate} />}
            {bookingTime && <Row label="Uhrzeit" value={`${bookingTime} Uhr`} />}
            {contactMethod && (
              <Row
                label="Kontaktweg"
                value={contactMethod === 'online' ? 'Online-Meeting' : 'Telefonat'}
              />
            )}
          </Section>
        )}

        <Section style={ctaSection}>
          <Text style={ctaText}>
            ⚡ <strong>Tipp:</strong> Melde dich innerhalb der nächsten 60 Minuten zurück
            – das erhöht die Abschlussquote deutlich.
          </Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          {submittedAt ? `Eingegangen: ${submittedAt}` : ''}
          {submittedAt ? ' · ' : ''}
          Automatische Benachrichtigung von {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

const Row = ({ label, value }: { label: string; value: string }) => (
  <Text style={rowText}>
    <span style={rowLabel}>{label}:</span>{' '}
    <span style={rowValue}>{value}</span>
  </Text>
)

export const template = {
  component: LeadNotificationEmail,
  subject: (data: Record<string, any>) => {
    const name = data?.firstName || 'Unbekannt'
    const company = data?.companyName ? ` · ${data.companyName}` : ''
    return `🎯 Neuer Lead: ${name}${company}`
  },
  displayName: 'Lead-Benachrichtigung',
  to: 'kouka@lkmarketing.de',
  previewData: {
    source: 'Kontaktformular',
    firstName: 'Max Mustermann',
    companyName: 'Mustermann GmbH',
    email: 'max@mustermann.de',
    phone: '+49 151 12345678',
    website: 'www.mustermann.de',
    message: 'Wir brauchen eine neue Website, die mehr Anfragen generiert.',
    submittedAt: '21.04.2026, 14:32',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
}

const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '24px 20px 40px',
}

const headerBar = {
  padding: '8px 0 16px',
}

const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#0a0a0a',
  margin: '0 0 8px',
  lineHeight: '1.3',
}

const subtitle = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
}

const card = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '20px 24px',
  margin: '20px 0',
}

const rowText = {
  fontSize: '15px',
  color: '#0f172a',
  margin: '0 0 10px',
  lineHeight: '1.5',
}

const rowLabel = {
  color: '#64748b',
  fontWeight: '600' as const,
  display: 'inline-block',
  minWidth: '70px',
}

const rowValue = {
  color: '#0f172a',
}

const labelLarge = {
  fontSize: '13px',
  color: '#64748b',
  fontWeight: '600' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '4px 0 8px',
}

const messageBox = {
  fontSize: '15px',
  color: '#0f172a',
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '14px 16px',
  margin: '0',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
}

const ctaSection = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fde68a',
  borderRadius: '10px',
  padding: '14px 18px',
  margin: '16px 0',
}

const bookingCard = {
  backgroundColor: '#ecfdf5',
  border: '1px solid #a7f3d0',
  borderRadius: '12px',
  padding: '16px 24px',
  margin: '16px 0',
}

const bookingHeader = {
  fontSize: '15px',
  fontWeight: 'bold' as const,
  color: '#065f46',
  margin: '0 0 10px',
}

const ctaText = {
  fontSize: '14px',
  color: '#78350f',
  margin: '0',
  lineHeight: '1.5',
}

const hr = {
  border: 'none',
  borderTop: '1px solid #e5e7eb',
  margin: '24px 0 12px',
}

const footer = {
  fontSize: '12px',
  color: '#94a3b8',
  margin: '0',
  textAlign: 'center' as const,
}