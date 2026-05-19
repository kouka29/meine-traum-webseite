/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  auftragsNr?: string
  kundeName?: string
  kundeFirma?: string
  kundeEmail?: string
  kundeTelefon?: string
  positions?: Array<{ titel: string; preis: number }>
  netto?: number
  mwst?: number
  brutto?: number
  ipAdresse?: string
  gebuchtAm?: string
  agbVersion?: string
}

const fmt = (n?: number) =>
  typeof n === 'number'
    ? n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0,00'

const BuchungAdminEmail = ({
  auftragsNr, kundeName, kundeFirma, kundeEmail, kundeTelefon,
  positions = [], netto, mwst, brutto, ipAdresse, gebuchtAm, agbVersion,
}: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Neue Buchung: {kundeName || 'Kunde'} — {auftragsNr || ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎉 Neue Buchung eingegangen</Heading>
        <Text style={text}>
          Auftrags-Nr: <strong>{auftragsNr}</strong><br />
          Zeitstempel: {gebuchtAm}
        </Text>

        <Section style={card}>
          <Text style={cardTitle}>Kunde</Text>
          <Text style={row}><strong>{kundeName}</strong>{kundeFirma ? ` · ${kundeFirma}` : ''}</Text>
          <Text style={row}>E-Mail: {kundeEmail}</Text>
          {kundeTelefon && <Text style={row}>Telefon: {kundeTelefon}</Text>}
        </Section>

        <Section style={card}>
          <Text style={cardTitle}>Auftragspositionen</Text>
          {positions.map((p, i) => (
            <Text key={i} style={rowFlex}>
              <span>{p.titel}</span>
              <span style={amount}>{fmt(p.preis)} €</span>
            </Text>
          ))}
          <Hr style={hr} />
          <Text style={rowFlex}><span>Netto</span><span style={amount}>{fmt(netto)} €</span></Text>
          <Text style={rowFlex}><span>MwSt 19%</span><span style={amount}>{fmt(mwst)} €</span></Text>
          <Text style={rowFlexBold}><span>Brutto</span><span style={amount}>{fmt(brutto)} €</span></Text>
        </Section>

        <Section style={legalCard}>
          <Text style={cardTitle}>Rechtsnachweis</Text>
          <Text style={row}>AGB akzeptiert: Ja · Version: {agbVersion || '1.0'}</Text>
          <Text style={row}>Kostenpflichtig bestätigt: Ja</Text>
          <Text style={row}>IP-Adresse: {ipAdresse || 'unbekannt'}</Text>
          <Text style={row}>Zeitstempel: {gebuchtAm}</Text>
        </Section>

        <Text style={footer}>Rechnung jetzt manuell erstellen und an den Kunden senden.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BuchungAdminEmail,
  subject: (d: Record<string, any>) =>
    `Neue Buchung: ${d.kundeName || 'Kunde'} — ${d.auftragsNr || ''}`,
  displayName: 'Buchung – Admin-Benachrichtigung',
  previewData: {
    auftragsNr: 'AB-2026-4821',
    kundeName: 'Max Mustermann',
    kundeFirma: 'Muster GmbH',
    kundeEmail: 'max@example.com',
    kundeTelefon: '+49 170 1234567',
    positions: [{ titel: 'Starter Paket', preis: 1490 }],
    netto: 1490, mwst: 283.1, brutto: 1773.1,
    ipAdresse: '1.2.3.4',
    gebuchtAm: new Date().toLocaleString('de-DE'),
    agbVersion: '1.0',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#1E1B4B', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const card = { background: '#F5F4FF', borderRadius: '12px', padding: '16px 20px', margin: '12px 0' }
const legalCard = { background: '#FEF3C7', borderRadius: '12px', padding: '16px 20px', margin: '12px 0' }
const cardTitle = { fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' as const, color: '#4F3FF0', margin: '0 0 10px', letterSpacing: '0.05em' }
const row = { fontSize: '14px', color: '#1E1B4B', margin: '4px 0' }
const rowFlex = { fontSize: '14px', color: '#1E1B4B', margin: '4px 0', display: 'flex' as const, justifyContent: 'space-between' as const }
const rowFlexBold = { fontSize: '15px', color: '#1E1B4B', margin: '8px 0 4px', display: 'flex' as const, justifyContent: 'space-between' as const, fontWeight: 'bold' }
const amount = { fontVariantNumeric: 'tabular-nums' as const, color: '#4F3FF0', fontWeight: 600 }
const hr = { border: 'none', borderTop: '1px solid rgba(79,63,240,0.2)', margin: '10px 0' }
const footer = { fontSize: '12px', color: '#6B7280', margin: '24px 0 0' }