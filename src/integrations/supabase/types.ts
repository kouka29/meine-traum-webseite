export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      angebote: {
        Row: {
          ablauf_datum: string | null
          addons: Json
          base64_data: string | null
          erstellt_am: string
          id: string
          lead_email: string | null
          lead_name: string | null
          normalpreis: number | null
          payment_config: Json
          pdf_path: string | null
          pin: string | null
          preis: number | null
          short_id: string | null
          status: string
          stripe_link: string | null
          user_id: string | null
        }
        Insert: {
          ablauf_datum?: string | null
          addons?: Json
          base64_data?: string | null
          erstellt_am?: string
          id?: string
          lead_email?: string | null
          lead_name?: string | null
          normalpreis?: number | null
          payment_config?: Json
          pdf_path?: string | null
          pin?: string | null
          preis?: number | null
          short_id?: string | null
          status?: string
          stripe_link?: string | null
          user_id?: string | null
        }
        Update: {
          ablauf_datum?: string | null
          addons?: Json
          base64_data?: string | null
          erstellt_am?: string
          id?: string
          lead_email?: string | null
          lead_name?: string | null
          normalpreis?: number | null
          payment_config?: Json
          pdf_path?: string | null
          pin?: string | null
          preis?: number | null
          short_id?: string | null
          status?: string
          stripe_link?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      buchungen: {
        Row: {
          addons: Json | null
          agb_akzeptiert: boolean
          agb_version: string
          angebots_id: string | null
          angebots_nr: string
          applied_codes: Json
          gebucht_am: string
          gesamtbetrag_brutto: number
          gesamtbetrag_netto: number
          id: string
          ip_adresse: string | null
          kostenpflichtig_bestaetigt: boolean
          kunde_email: string
          kunde_firma: string
          kunde_nachname: string
          kunde_telefon: string | null
          kunde_vorname: string
          leistungen: Json | null
          mwst: number
          notizen: string | null
          pakete: Json | null
          payment_method: string
          status: string
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          addons?: Json | null
          agb_akzeptiert?: boolean
          agb_version?: string
          angebots_id?: string | null
          angebots_nr: string
          applied_codes?: Json
          gebucht_am?: string
          gesamtbetrag_brutto?: number
          gesamtbetrag_netto?: number
          id?: string
          ip_adresse?: string | null
          kostenpflichtig_bestaetigt?: boolean
          kunde_email: string
          kunde_firma: string
          kunde_nachname: string
          kunde_telefon?: string | null
          kunde_vorname: string
          leistungen?: Json | null
          mwst?: number
          notizen?: string | null
          pakete?: Json | null
          payment_method?: string
          status?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          addons?: Json | null
          agb_akzeptiert?: boolean
          agb_version?: string
          angebots_id?: string | null
          angebots_nr?: string
          applied_codes?: Json
          gebucht_am?: string
          gesamtbetrag_brutto?: number
          gesamtbetrag_netto?: number
          id?: string
          ip_adresse?: string | null
          kostenpflichtig_bestaetigt?: boolean
          kunde_email?: string
          kunde_firma?: string
          kunde_nachname?: string
          kunde_telefon?: string | null
          kunde_vorname?: string
          leistungen?: Json | null
          mwst?: number
          notizen?: string | null
          pakete?: Json | null
          payment_method?: string
          status?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      checkout_sessions: {
        Row: {
          angebots_nr: string | null
          applied_codes: Json
          created_at: string
          email: string | null
          expires_at: string
          id: string
          invoice_allowed: boolean
          updated_at: string
        }
        Insert: {
          angebots_nr?: string | null
          applied_codes?: Json
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          invoice_allowed?: boolean
          updated_at?: string
        }
        Update: {
          angebots_nr?: string | null
          applied_codes?: Json
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          invoice_allowed?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      code_redemption_log: {
        Row: {
          code: string
          created_at: string
          id: string
          ip_address: unknown
          reason: string | null
          session_id: string | null
          success: boolean
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          ip_address: unknown
          reason?: string | null
          session_id?: string | null
          success: boolean
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          reason?: string | null
          session_id?: string | null
          success?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "code_redemption_log_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "checkout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_accounts: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          first_name: string | null
          invoice_allowed: boolean
          phone: string | null
          stripe_customer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          invoice_allowed?: boolean
          phone?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          invoice_allowed?: boolean
          phone?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_ticket_messages: {
        Row: {
          attachments: Json
          author_type: string
          author_user_id: string | null
          created_at: string
          id: string
          message: string
          ticket_id: string
        }
        Insert: {
          attachments?: Json
          author_type: string
          author_user_id?: string | null
          created_at?: string
          id?: string
          message: string
          ticket_id: string
        }
        Update: {
          attachments?: Json
          author_type?: string
          author_user_id?: string | null
          created_at?: string
          id?: string
          message?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "customer_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_tickets: {
        Row: {
          attachments: Json
          created_at: string
          id: string
          message: string
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json
          created_at?: string
          id?: string
          message: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json
          created_at?: string
          id?: string
          message?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      design_settings: {
        Row: {
          apple_design_enabled: boolean
          id: number
          updated_at: string
        }
        Insert: {
          apple_design_enabled?: boolean
          id?: number
          updated_at?: string
        }
        Update: {
          apple_design_enabled?: boolean
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          active: boolean
          amount_off_cents: number | null
          code: string
          created_at: string
          expires_at: string | null
          label: string
          max_uses: number | null
          percent_off: number | null
          stripe_coupon: string | null
          type: string
          unlock_flag: string | null
          used_count: number
        }
        Insert: {
          active?: boolean
          amount_off_cents?: number | null
          code: string
          created_at?: string
          expires_at?: string | null
          label: string
          max_uses?: number | null
          percent_off?: number | null
          stripe_coupon?: string | null
          type: string
          unlock_flag?: string | null
          used_count?: number
        }
        Update: {
          active?: boolean
          amount_off_cents?: number | null
          code?: string
          created_at?: string
          expires_at?: string | null
          label?: string
          max_uses?: number | null
          percent_off?: number | null
          stripe_coupon?: string | null
          type?: string
          unlock_flag?: string | null
          used_count?: number
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      funnel_leads: {
        Row: {
          created_at: string
          datenschutz_akzeptiert: boolean
          email: string | null
          firmenname: string | null
          foto_urls: string[]
          gewerk: string | null
          hat_website: boolean | null
          id: string
          kein_logo: boolean
          kontaktart: string | null
          leistungen: string | null
          logo_url: string | null
          month_key: string | null
          name: string | null
          ort: string | null
          source_cta: string
          source_page: string | null
          status: string
          stil: string | null
          telefon: string | null
          termin_datum: string | null
          termin_uhrzeit: string | null
          updated_at: string
          website_url: string | null
          ziel: string | null
        }
        Insert: {
          created_at?: string
          datenschutz_akzeptiert?: boolean
          email?: string | null
          firmenname?: string | null
          foto_urls?: string[]
          gewerk?: string | null
          hat_website?: boolean | null
          id?: string
          kein_logo?: boolean
          kontaktart?: string | null
          leistungen?: string | null
          logo_url?: string | null
          month_key?: string | null
          name?: string | null
          ort?: string | null
          source_cta?: string
          source_page?: string | null
          status?: string
          stil?: string | null
          telefon?: string | null
          termin_datum?: string | null
          termin_uhrzeit?: string | null
          updated_at?: string
          website_url?: string | null
          ziel?: string | null
        }
        Update: {
          created_at?: string
          datenschutz_akzeptiert?: boolean
          email?: string | null
          firmenname?: string | null
          foto_urls?: string[]
          gewerk?: string | null
          hat_website?: boolean | null
          id?: string
          kein_logo?: boolean
          kontaktart?: string | null
          leistungen?: string | null
          logo_url?: string | null
          month_key?: string | null
          name?: string | null
          ort?: string | null
          source_cta?: string
          source_page?: string | null
          status?: string
          stil?: string | null
          telefon?: string | null
          termin_datum?: string | null
          termin_uhrzeit?: string | null
          updated_at?: string
          website_url?: string | null
          ziel?: string | null
        }
        Relationships: []
      }
      growth_subscriptions: {
        Row: {
          billing_mode: string
          cancel_at: string | null
          created_at: string
          customer_email: string
          environment: string
          id: string
          last_invoice_at: string | null
          last_invoice_id: string | null
          last_invoice_status: string | null
          min_term_months: number
          monthly_amount_cents: number
          next_invoice_at: string | null
          package: string
          purchase_session_id: string | null
          started_at: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_mode?: string
          cancel_at?: string | null
          created_at?: string
          customer_email: string
          environment?: string
          id?: string
          last_invoice_at?: string | null
          last_invoice_id?: string | null
          last_invoice_status?: string | null
          min_term_months?: number
          monthly_amount_cents: number
          next_invoice_at?: string | null
          package: string
          purchase_session_id?: string | null
          started_at?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_mode?: string
          cancel_at?: string | null
          created_at?: string
          customer_email?: string
          environment?: string
          id?: string
          last_invoice_at?: string | null
          last_invoice_id?: string | null
          last_invoice_status?: string | null
          min_term_months?: number
          monthly_amount_cents?: number
          next_invoice_at?: string | null
          package?: string
          purchase_session_id?: string | null
          started_at?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      invoice_confirmation_codes: {
        Row: {
          angebots_id: string | null
          attempts: number
          code_hash: string
          consumed_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
        }
        Insert: {
          angebots_id?: string | null
          attempts?: number
          code_hash: string
          consumed_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
        }
        Update: {
          angebots_id?: string | null
          attempts?: number
          code_hash?: string
          consumed_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          booking_date: string | null
          booking_time: string | null
          branche: string | null
          budget_modell: string | null
          budget_wert: string | null
          company_name: string | null
          contact_method: string | null
          created_at: string
          current_website: string | null
          email: string | null
          first_name: string | null
          goals: string[] | null
          has_website: string | null
          id: string
          is_waitlist: boolean
          message: string | null
          notes: string | null
          ort: string | null
          phone: string | null
          slot_reserved: boolean
          source_cta: string | null
          source_page: string | null
          status: string
          trade: string | null
          trade_other: string | null
          urgency: string | null
          user_id: string | null
        }
        Insert: {
          booking_date?: string | null
          booking_time?: string | null
          branche?: string | null
          budget_modell?: string | null
          budget_wert?: string | null
          company_name?: string | null
          contact_method?: string | null
          created_at?: string
          current_website?: string | null
          email?: string | null
          first_name?: string | null
          goals?: string[] | null
          has_website?: string | null
          id?: string
          is_waitlist?: boolean
          message?: string | null
          notes?: string | null
          ort?: string | null
          phone?: string | null
          slot_reserved?: boolean
          source_cta?: string | null
          source_page?: string | null
          status?: string
          trade?: string | null
          trade_other?: string | null
          urgency?: string | null
          user_id?: string | null
        }
        Update: {
          booking_date?: string | null
          booking_time?: string | null
          branche?: string | null
          budget_modell?: string | null
          budget_wert?: string | null
          company_name?: string | null
          contact_method?: string | null
          created_at?: string
          current_website?: string | null
          email?: string | null
          first_name?: string | null
          goals?: string[] | null
          has_website?: string | null
          id?: string
          is_waitlist?: boolean
          message?: string | null
          notes?: string | null
          ort?: string | null
          phone?: string | null
          slot_reserved?: boolean
          source_cta?: string | null
          source_page?: string | null
          status?: string
          trade?: string | null
          trade_other?: string | null
          urgency?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          device_type: string | null
          id: string
          page_path: string
          referrer: string | null
          screen_width: number | null
          timezone: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          id?: string
          page_path: string
          referrer?: string | null
          screen_width?: number | null
          timezone?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          device_type?: string | null
          id?: string
          page_path?: string
          referrer?: string | null
          screen_width?: number | null
          timezone?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          category: string
          created_at: string
          description: string
          external_url: string
          id: string
          image_url: string
          is_visible: boolean
          mockup_desktop_url: string
          mockup_mobile_url: string
          result: string
          screenshot_updated_at: string | null
          screenshot_url: string
          sort_order: number
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          external_url?: string
          id?: string
          image_url?: string
          is_visible?: boolean
          mockup_desktop_url?: string
          mockup_mobile_url?: string
          result?: string
          screenshot_updated_at?: string | null
          screenshot_url?: string
          sort_order?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          external_url?: string
          id?: string
          image_url?: string
          is_visible?: boolean
          mockup_desktop_url?: string
          mockup_mobile_url?: string
          result?: string
          screenshot_updated_at?: string | null
          screenshot_url?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string | null
          deposit_amount_cents: number
          environment: string
          id: string
          lead_id: string | null
          metadata: Json | null
          package: string
          status: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string
          total_amount_cents: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          deposit_amount_cents: number
          environment?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          package: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id: string
          total_amount_cents: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          deposit_amount_cents?: number
          environment?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          package?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string
          total_amount_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          name: string
          result: string
          role: string
          sort_order: number
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          name: string
          result?: string
          role?: string
          sort_order?: number
          text?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          name?: string
          result?: string
          role?: string
          sort_order?: number
          text?: string
        }
        Relationships: []
      }
      vorschau_anfragen: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          month_key: string
          name: string
          phone: string | null
          source_page: string
          status: string
          website_url: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          month_key: string
          name: string
          phone?: string | null
          source_page: string
          status?: string
          website_url?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          month_key?: string
          name?: string
          phone?: string | null
          source_page?: string
          status?: string
          website_url?: string | null
        }
        Relationships: []
      }
      vorschau_bewerbungen: {
        Row: {
          budget: string
          created_at: string
          email: string
          firmenname: string
          gewerk: string
          hat_website: boolean
          id: string
          name: string
          ort: string
          source_cta: string
          status: string
          telefon: string
          timeline: string
          typ: string
          updated_at: string
          warum: string
          website_url: string | null
        }
        Insert: {
          budget: string
          created_at?: string
          email: string
          firmenname: string
          gewerk: string
          hat_website?: boolean
          id?: string
          name: string
          ort: string
          source_cta?: string
          status?: string
          telefon: string
          timeline: string
          typ?: string
          updated_at?: string
          warum: string
          website_url?: string | null
        }
        Update: {
          budget?: string
          created_at?: string
          email?: string
          firmenname?: string
          gewerk?: string
          hat_website?: boolean
          id?: string
          name?: string
          ort?: string
          source_cta?: string
          status?: string
          telefon?: string
          timeline?: string
          typ?: string
          updated_at?: string
          warum?: string
          website_url?: string | null
        }
        Relationships: []
      }
      vorschau_demos: {
        Row: {
          company: string
          created_at: string
          description: string
          id: string
          image_url: string
          is_visible: boolean
          page_key: string
          portfolio_project_id: string | null
          sort_order: number
          trade: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_visible?: boolean
          page_key?: string
          portfolio_project_id?: string | null
          sort_order?: number
          trade?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_visible?: boolean
          page_key?: string
          portfolio_project_id?: string | null
          sort_order?: number
          trade?: string
        }
        Relationships: [
          {
            foreignKeyName: "vorschau_demos_portfolio_project_id_fkey"
            columns: ["portfolio_project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      vorschau_faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_visible: boolean
          page_key: string
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          is_visible?: boolean
          page_key?: string
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_visible?: boolean
          page_key?: string
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      vorschau_settings: {
        Row: {
          countdown_label: string
          countdown_mode: string
          countdown_target: string | null
          final_cta_button: string
          final_cta_headline: string
          final_cta_subtext: string
          hero_badge_text: string
          hero_cta_label: string
          hero_h1_line1: string
          hero_h1_line2: string
          hero_h1_line3: string
          hero_subheadline: string
          id: number
          page_key: string
          phone_number: string
          show_countdown: boolean
          show_demos: boolean
          show_faq: boolean
          show_pain_points: boolean
          show_process: boolean
          show_slots: boolean
          show_testimonials: boolean
          taken_slots: number
          total_slots: number
          updated_at: string
        }
        Insert: {
          countdown_label?: string
          countdown_mode?: string
          countdown_target?: string | null
          final_cta_button?: string
          final_cta_headline?: string
          final_cta_subtext?: string
          hero_badge_text?: string
          hero_cta_label?: string
          hero_h1_line1?: string
          hero_h1_line2?: string
          hero_h1_line3?: string
          hero_subheadline?: string
          id?: number
          page_key?: string
          phone_number?: string
          show_countdown?: boolean
          show_demos?: boolean
          show_faq?: boolean
          show_pain_points?: boolean
          show_process?: boolean
          show_slots?: boolean
          show_testimonials?: boolean
          taken_slots?: number
          total_slots?: number
          updated_at?: string
        }
        Update: {
          countdown_label?: string
          countdown_mode?: string
          countdown_target?: string | null
          final_cta_button?: string
          final_cta_headline?: string
          final_cta_subtext?: string
          hero_badge_text?: string
          hero_cta_label?: string
          hero_h1_line1?: string
          hero_h1_line2?: string
          hero_h1_line3?: string
          hero_subheadline?: string
          id?: number
          page_key?: string
          phone_number?: string
          show_countdown?: boolean
          show_demos?: boolean
          show_faq?: boolean
          show_pain_points?: boolean
          show_process?: boolean
          show_slots?: boolean
          show_testimonials?: boolean
          taken_slots?: number
          total_slots?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      attach_booking_to_lead: {
        Args: {
          p_booking_date: string
          p_booking_time: string
          p_contact_method: string
          p_current_website?: string
          p_goals?: string[]
          p_has_website?: string
          p_lead_id: string
          p_notes?: string
          p_trade?: string
          p_trade_other?: string
          p_urgency?: string
        }
        Returns: boolean
      }
      count_freigegebene_leads_this_month: { Args: never; Returns: number }
      decrement_taken_slot:
        | { Args: never; Returns: undefined }
        | { Args: { p_page_key?: string }; Returns: undefined }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      increment_taken_slot:
        | { Args: never; Returns: undefined }
        | { Args: { p_page_key?: string }; Returns: undefined }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      set_lead_contact_method: {
        Args: { p_contact_method: string; p_lead_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
