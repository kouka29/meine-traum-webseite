import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Meine Traum Webseite"

interface LeadQualifiedProps {
  firstName?: string
}

const LeadQualifiedEmail = ({ firstName }: LeadQualifiedProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Dein Platz für die kostenlose Webseiten-Vorschau ist jetzt offiziell gesichert</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {firstName ? `${firstName}, dein Platz ist gesichert!` : 'Dein Platz ist gesichert!'}
        </Heading>
        <Text style={text}>
          Gute Nachrichten – wir haben deine Anfrage geprüft und du gehörst jetzt
          fest zu den Betrieben, für die wir diesen Monat eine kostenlose
          Webseiten-Vorschau erstellen.
        </Text>
        <Section style={highlight}>
          <Text style={highlightText}>
            ✅ Dein Platz ist offiziell für dich reserviert
          </Text>
        </Section>
        <Heading as="h2" style={h2}>So geht's weiter</Heading>
        <Text style={text}>
          <strong>1.</strong> Wir melden uns in Kürze für ein kurzes 5–10 Min. Gespräch,
          damit deine Vorschau perfekt zu deinem Betrieb passt.
        </Text>
        <Text style={text}>
          <strong>2.</strong> Innerhalb von 48 Stunden bauen wir dir deine kostenlose Vorschau.
        </Text>
        <Text style={text}>
          <strong>3.</strong> Wir schauen sie gemeinsam an – ohne Druck, ohne Verpflichtung.
        </Text>
        <Text style={footer}>
          Liebe Grüße,<br />Dein Team von {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: LeadQualifiedEmail,
  subject: 'Dein Platz für die kostenlose Webseiten-Vorschau ist gesichert ✅',
  displayName: 'Lead qualifiziert – Platz gesichert',
  previewData: { firstName: 'Max' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px' }
const h2 = { fontSize: '17px', fontWeight: 'bold', color: '#0f172a', margin: '24px 0 12px' }
const text = { fontSize: '14px', color: '#334155', lineHeight: '1.6', margin: '0 0 14px' }
const highlight = { backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '14px 16px', margin: '16px 0 8px' }
const highlightText = { fontSize: '14px', color: '#065f46', fontWeight: 'bold', margin: '0' }
const footer = { fontSize: '13px', color: '#64748b', margin: '28px 0 0' }
