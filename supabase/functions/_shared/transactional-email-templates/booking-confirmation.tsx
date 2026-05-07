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

const SITE_NAME = 'Meine Traum Webseite'

interface BookingConfirmationProps {
  firstName?: string
  bookingDate?: string
  bookingTime?: string
  contactMethod?: string
}

const BookingConfirmationEmail = ({
  firstName,
  bookingDate,
  bookingTime,
  contactMethod,
}: BookingConfirmationProps) => {
  const methodLabel =
    contactMethod === 'online' ? 'Online-Meeting' : 'Telefonat'
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>
        Ihr Termin ist bestätigt
        {bookingDate ? ` – ${bookingDate}` : ''}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            ✅ {firstName ? `${firstName}, Ihr` : 'Ihr'} Termin steht!
          </Heading>
          <Text style={text}>
            Vielen Dank für Ihre Buchung. Wir freuen uns auf das Gespräch.
          </Text>

          <Section style={card}>
            <Text style={cardTitle}>📅 Ihre Termin-Details</Text>
            {bookingDate && (
              <Text style={rowText}>
                <span style={rowLabel}>Datum:</span>{' '}
                <span style={rowValue}>{bookingDate}</span>
              </Text>
            )}
            {bookingTime && (
              <Text style={rowText}>
                <span style={rowLabel}>Uhrzeit:</span>{' '}
                <span style={rowValue}>{bookingTime} Uhr</span>
              </Text>
            )}
            <Text style={rowText}>
              <span style={rowLabel}>Format:</span>{' '}
              <span style={rowValue}>{methodLabel}</span>
            </Text>
          </Section>

          <Text style={textBold}>So geht's weiter:</Text>
          <Text style={text}>
            1. Wir telefonieren bzw. treffen uns online (5–10 Minuten) und
            klären ein paar Fragen zu Ihrem Betrieb.
          </Text>
          <Text style={text}>
            2. Innerhalb von 48 Stunden bauen wir Ihre kostenlose Webseiten-Vorschau.
          </Text>
          <Text style={text}>
            3. Wir schauen sie gemeinsam an – Sie entscheiden in Ruhe, ob es
            für Sie passt. Ohne Druck, ohne Verpflichtung.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>
            Solltest Sie den Termin verschieben müssen, antworte einfach kurz
            auf diese E-Mail. — Ihr Team von {SITE_NAME}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: BookingConfirmationEmail,
  subject: (data: Record<string, any>) => {
    const date = data?.bookingDate ? ` (${data.bookingDate})` : ''
    return `✅ Ihr Termin ist bestätigt${date}`
  },
  displayName: 'Termin-Bestätigung (Kunde)',
  previewData: {
    firstName: 'Max',
    bookingDate: 'Mo., 28.04.',
    bookingTime: '14:00',
    contactMethod: 'phone',
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

const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#0a0a0a',
  margin: '0 0 16px',
  lineHeight: '1.3',
}

const text = {
  fontSize: '15px',
  color: '#334155',
  margin: '0 0 12px',
  lineHeight: '1.6',
}

const textBold = {
  fontSize: '15px',
  color: '#0f172a',
  fontWeight: 'bold' as const,
  margin: '20px 0 8px',
}

const card = {
  backgroundColor: '#ecfdf5',
  border: '1px solid #a7f3d0',
  borderRadius: '12px',
  padding: '20px 24px',
  margin: '20px 0',
}

const cardTitle = {
  fontSize: '15px',
  fontWeight: 'bold' as const,
  color: '#065f46',
  margin: '0 0 12px',
}

const rowText = {
  fontSize: '15px',
  color: '#0f172a',
  margin: '0 0 8px',
  lineHeight: '1.5',
}

const rowLabel = {
  color: '#475569',
  fontWeight: '600' as const,
  display: 'inline-block',
  minWidth: '80px',
}

const rowValue = {
  color: '#0f172a',
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
  lineHeight: '1.6',
}