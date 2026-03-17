import { createHighlighter, type ThemeRegistration } from 'shiki'
import { ApiSectionClient } from './ApiSectionClient'

// ── Shiki themes ────────────────────────────────────────────────────────────

const supabaseDark: ThemeRegistration = {
  name: 'supabase-dark',
  type: 'dark',
  colors: {
    'editor.background': '#00000000',
    'editor.foreground': '#ffffff',
  },
  tokenColors: [
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier'], settings: { foreground: '#bda4ff' } },
    { scope: ['entity.name.function', 'support.function', 'entity.name.tag', 'support.class.component'], settings: { foreground: '#3ecf8e' } },
    { scope: ['constant', 'variable.other.constant', 'support.constant'], settings: { foreground: '#3ecf8e' } },
    { scope: ['variable.other.property', 'support.type.property-name', 'meta.object-literal.key', 'entity.other.attribute-name'], settings: { foreground: '#3ecf8e' } },
    { scope: ['string', 'string.quoted'], settings: { foreground: '#ffcda1' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#7e7e7e' } },
    { scope: ['variable.parameter'], settings: { foreground: '#ffffff' } },
    { scope: ['punctuation'], settings: { foreground: '#ffffff' } },
    { scope: ['constant.numeric'], settings: { foreground: '#ededed' } },
    { scope: ['markup.underline.link'], settings: { foreground: '#ffffff' } },
    { scope: ['markup.inserted'], settings: { foreground: '#3ecf8e' } },
    { scope: ['markup.deleted'], settings: { foreground: '#F06A50' } },
  ],
}

const supabaseLight: ThemeRegistration = {
  name: 'supabase-light',
  type: 'light',
  colors: {
    'editor.background': '#00000000',
    'editor.foreground': '#525252',
  },
  tokenColors: [
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier'], settings: { foreground: '#6b35dc' } },
    { scope: ['entity.name.function', 'support.function', 'entity.name.tag', 'support.class.component'], settings: { foreground: '#15593b' } },
    { scope: ['constant', 'variable.other.constant', 'support.constant'], settings: { foreground: '#15593b' } },
    { scope: ['variable.other.property', 'support.type.property-name', 'meta.object-literal.key', 'entity.other.attribute-name'], settings: { foreground: '#15593b' } },
    { scope: ['string', 'string.quoted'], settings: { foreground: '#f1a10d' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#7e7e7e' } },
    { scope: ['variable.parameter'], settings: { foreground: '#525252' } },
    { scope: ['punctuation'], settings: { foreground: '#a0a0a0' } },
    { scope: ['constant.numeric'], settings: { foreground: '#525252' } },
    { scope: ['markup.underline.link'], settings: { foreground: '#525252' } },
  ],
}

// ── API examples ────────────────────────────────────────────────────────────

const API_EXAMPLES = [
  {
    title: 'Fetch records',
    code: `// Fetch all public rooms with their messages
const { data: rooms } = await supabase
  .from('rooms')
  .select(\`
    id, name, created_at,
    messages ( id, text, user_id )
  \`)
  .eq('public', true)
  .order('created_at', { ascending: false })
  .limit(20)`,
  },
  {
    title: 'Insert with relations',
    code: `// Create a room and its first message
const { data: room } = await supabase
  .from('rooms')
  .insert({ name: 'Design Team', public: false })
  .select()
  .single()

await supabase
  .from('messages')
  .insert({
    room_id: room.id,
    text: 'Welcome to the team channel!',
    user_id: session.user.id,
  })`,
  },
  {
    title: 'Update records',
    code: `// Update a room and return the updated row
const { data: updated } = await supabase
  .from('rooms')
  .update({
    name: 'Engineering Team',
    public: false,
    updated_at: new Date().toISOString(),
  })
  .eq('id', roomId)
  .select()
  .single()`,
  },
  {
    title: 'Filter & paginate',
    code: `// Full-text search with pagination
const { data, count } = await supabase
  .from('rooms')
  .select('id, name, member_count', { count: 'exact' })
  .textSearch('name', 'design')
  .gte('member_count', 5)
  .range(0, 9)
  .order('member_count', { ascending: false })`,
  },
]

// ── Server component: pre-highlights all code ───────────────────────────────

export async function ApiSection() {
  const hl = await createHighlighter({
    themes: [supabaseDark, supabaseLight],
    langs: ['javascript'],
  })

  const examples = API_EXAMPLES.map((example) => ({
    title: example.title,
    darkHtml: hl.codeToHtml(example.code, { lang: 'javascript', theme: 'supabase-dark' }),
    lightHtml: hl.codeToHtml(example.code, { lang: 'javascript', theme: 'supabase-light' }),
  }))

  hl.dispose()

  return <ApiSectionClient examples={examples} />
}
