export interface SendMailParams {
  to: string;
  subject: string;
  vars?: Record<string, any>;
  template?: string;
  html?: string;
  attachments?: { filename: string; content: Buffer }[];
}
