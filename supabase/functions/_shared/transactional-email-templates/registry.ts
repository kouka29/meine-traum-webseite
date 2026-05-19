/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as leadNotification } from './lead-notification.tsx'
import { template as bookingConfirmation } from './booking-confirmation.tsx'
import { template as leadQualified } from './lead-qualified.tsx'
import { template as buchungAdminNotification } from './buchung-admin-notification.tsx'
import { template as buchungKundeBestaetigung } from './buchung-kunde-bestaetigung.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'lead-notification': leadNotification,
  'booking-confirmation': bookingConfirmation,
  'lead-qualified': leadQualified,
  'buchung-admin-notification': buchungAdminNotification,
  'buchung-kunde-bestaetigung': buchungKundeBestaetigung,
}