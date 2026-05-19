/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  auftragsNr?: string
  kundeVorname?: string
  kundeNachname?: string
  positions?: Array<{ titel: string; preis: number }>
  netto?: number
  mwst?: number
  brutto?: number
  gebuchtAm?: string
}

const fmt = (n?: number) =>
  typeof n === 'number'
    ? n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0,00'

const BuchungKundeEmail = ({
  auftragsNr, kundeVorname, kundeNachname, positions = [], netto, mwst, brutto, gebuchtAm,
}: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Ihre Auftragsbestätigung {auftragsNr || ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Ihre Auftragsbestätigung</Heading>
        <Text style={text}>
          Sehr geehrte/r {kundeVorname} {kundeNachname},
        </Text>
        <Text style={text}>
          vielen Dank für Ihren Auftrag. Wir bestätigen den Eingang Ihrer
          verbindlichen Auftragserteilung.
        </Text>

        <Section style={card}>
          <Text style={cardTitle}>Auftragsübersicht</Text>
          {positions.map((p, i) => (
            <Text key={i} style={rowFlex}>
              <span>{p.titel}</span>
              <span style={amount}>{fmt(p.preis)} €</span>
            </Text>
          ))}
          <Hr style={hr} />
          <Text style={rowFlex}><span>Netto</span><span style={amount}>{fmt(netto)} €</span></Text>
          <Text style={rowFlex}><span>zzgl. 19% MwSt</span><span style={amount}>{fmt(mwst)} €</span></Text>
          <Text style={rowFlexBold}><span>Gesamtbetrag (brutto)</span><span style={amount}>{fmt(brutto)} €</span></Text>
        </Section>

        <Text style={text}>
          Die Rechnung erhalten Sie in Kürze per E-Mail. Die Umsetzung beginnt
          nach Zahlungseingang.
        </Text>

        <Text style={meta}>
          Auftrags-Nr: <strong>{auftragsNr}</strong><br />
          Datum: {gebuchtAm}
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          QK Marketing Group · Rheinallee 88 · 55120 Mainz<br />
          info@qkmarketing.de · Tel.: 06131 30 765 96
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BuchungKundeEmail,
  subject: (d: Record<string, any>) =>
    `Ihre Auftragsbestätigung — QK Marketing Group ${d.auftragsNr || ''}`,
  displayName: 'Buchung – Kunden-Bestätigung',
  previewData: {
    auftragsNr: 'AB-2026-4821',
    kundeVorname: 'Max',
    kundeNachname: 'Mustermann',
    positions: [{ titel: 'Starter Paket', preis: 1490 }],
    netto: 1490, mwst: 283.1, brutto: 1773.1,
    gebuchtAm: new Date().toLocaleString('de-DE'),
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#1E1B4B', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const card = { background: '#F5F4FF', borderRadius: '12px', padding: '20px 22px', margin: '16px 0' }
const cardTitle = { fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' as const, color: '#4F3FF0', margin: '0 0 12px', letterSpacing: '0.05em' }
const rowFlex = { fontSize: '14px', color: '#1E1B4B', margin: '6px 0', display: 'flex' as const, justifyContent: 'space-between' as const }
const rowFlexBold = { fontSize: '16px', color: '#1E1B4B', margin: '10px 0 4px', display: 'flex' as const, justifyContent: 'space-between' as const, fontWeight: 'bold' }
const amount = { fontVariantNumeric: 'tabular-nums' as const, color: '#4F3FF0', fontWeight: 600 }
const hr = { border: 'none', borderTop: '1px solid rgba(79,63,240,0.2)', margin: '12px 0' }
const meta = { fontSize: '13px', color: '#6B7280', margin: '20px 0 0' }
const footer = { fontSize: '12px', color: '#9CA3AF', lineHeight: '1.6', margin: '8px 0 0' }