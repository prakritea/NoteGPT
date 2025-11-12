import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const logos = ["Harvard","Stanford","UCL","Bristol","CalTech","Oxford"];
const stats = [
  { label: "Learners", value: "4M+" },
  { label: "Docs summarized", value: "18M+" },
  { label: "Avg time saved", value: "10x" },
  { label: "Countries", value: "120+" },
];

export default function Index() {
  const [tab, setTab] = useState<'youtube'|'pdf'|'chat'|'ppt'>('youtube');

  return (
    <div>
      {/* Hero with animated gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[url('https://cdn.builder.io/api/v1/image/assets%2Fd23423baf1f24c0a91a009b1b7cbc319%2F72467e23cd2d4c6e897ee66c0cd1d120?format=webp&width=1600')] bg-cover bg-center opacity-90" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/70 via-white/60 to-transparent dark:from-background/80 dark:via-background/70" />
        <div className="container pb-20 pt-20 text-center">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs text-foreground/80 backdrop-blur">
              New: AI Study Planner • Flashcards • YouTube Summaries
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Learn 10x Faster with AI
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Summarize videos, PDFs, and notes. Generate slides and flashcards. Chat with your knowledge — in one place.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button asChild size="lg" className="px-8">
                <Link to="/dashboard">Try Free Now</Link>
              </Button>
              <a
                href="#chrome"
                className="inline-flex items-center rounded-md border px-5 py-3 text-sm font-medium text-foreground hover:bg-accent"
              >
                Add to Chrome
              </a>
            </div>
          </div>

          {/* Hero preview cards with aligned indentation */}
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {["YouTube → Notes","PDF → Summary","Chat with Notes"].map((t,i)=> (
              <div key={i} className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-card">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg" style={{background: i===0? 'hsl(var(--brand-blue))' : i===1 ? 'hsl(var(--brand-lime))' : 'hsl(var(--brand-purple))'}} />
                  <div>
                    <div className="text-left text-lg font-semibold">{t}</div>
                    <p className="mt-1 text-left text-sm text-muted-foreground">One click to generate clean notes and key takeaways.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Fun Facts */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Fun facts</h2>
          <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              { t: 'Most summarized', d: 'YouTube lectures (CS/Math) at 62% of usage' },
              { t: 'Avg note length', d: '1,240 words condensed to 220 words' },
              { t: 'Fastest flow', d: 'PDF → Notes → Flashcards in under 30s' },
            ].map((f)=> (
              <div key={f.t} className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="text-sm text-muted-foreground">{f.t}</div>
                <div className="mt-1 font-semibold">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">What learners say</h2>
          <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              { name: 'Aisha', role: 'Student', text: 'NoteGPT helped me finish readings 5x faster. The summaries are spot‑on.' },
              { name: 'Marco', role: 'Engineer', text: 'I feed lectures and get clean notes + flashcards. Fantastic workflow.' },
              { name: 'Priya', role: 'Researcher', text: 'PDF summarization saves hours. Dark mode looks amazing.' },
            ].map((t)=> (
              <div key={t.name} className="rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-2 flex items-center gap-3">
                  <div className="size-8 rounded-full bg-[hsl(var(--brand-purple))]" />
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
                <div className="mb-2 text-amber-500">★★★★★</div>
                <p className="text-sm text-muted-foreground">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Tabs */}
      <section id="features" className="border-t bg-gradient-to-b from-white to-[hsl(var(--brand-lightblue)/0.4)] py-16 dark:from-background dark:to-transparent">
        <div className="container">
          <h2 className="text-center text-3xl font-bold md:text-4xl">Everything you need</h2>
          <div className="mx-auto mt-8 max-w-5xl rounded-2xl border bg-card p-2">
            <div className="grid grid-cols-4 gap-2">
              {(['youtube','pdf','chat','ppt'] as const).map(k=> (
                <button key={k} onClick={()=> setTab(k)} className={`rounded-md px-3 py-2 text-sm transition ${tab===k? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>{k.toUpperCase()}</button>
              ))}
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border bg-white p-6 dark:bg-secondary">
                <div className="mb-2 text-xl font-semibold capitalize">{tab} workflow</div>
                <p className="text-sm text-muted-foreground">Paste content and click summarize or generate. Edit, export, and share.</p>
                <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Fast summaries with key points</li>
                  <li>Mind‑map and flashcard generation</li>
                  <li>One‑click export to notes and slides</li>
                </ul>
              </div>
              <div className="rounded-xl border p-6">
                <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-[hsl(var(--brand-blue))] via-[hsl(var(--brand-pink))] to-[hsl(var(--brand-lime))] opacity-80" />
                <p className="mt-3 text-xs text-muted-foreground">Illustrative preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-step */}
      <section id="how" className="py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">How it works</h2>
          <div className="mx-auto mt-8 max-w-5xl grid gap-6 md:grid-cols-3">
            {["Add content","Generate","Study"].map((t,i)=> (
              <div key={i} className="rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg text-primary" style={{background: 'hsl(var(--brand-blue)/0.15)'}}>{i+1}</div>
                <div className="font-semibold">{t}</div>
                <p className="mt-1 text-sm text-muted-foreground">{i===0? 'Paste a YouTube link or upload a PDF.' : i===1? 'Create summaries, slides, and flashcards.' : 'Review with AI chat and planner.'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Simple pricing</h2>
          <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              { name: 'Free', price: '$0', features: ['10 summaries / month','Basic chat','Community support'], cta: 'Get Started' },
              { name: 'Pro', price: '$9', highlight: true, features: ['Unlimited summaries','AI PPT & Flashcards','Priority support'], cta: 'Try Pro' },
              { name: 'Team', price: '$29', features: ['5 seats','Shared library','Admin controls'], cta: 'Start Team' },
            ].map((p)=> (
              <div key={p.name} className={`rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${p.highlight? 'ring-2 ring-[hsl(var(--brand-lime))]' : ''}`}>
                <div className="mb-2 text-sm text-muted-foreground">{p.name}</div>
                <div className="text-3xl font-extrabold">{p.price}<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.features.map(f=> <li key={f} className="flex items-center gap-2"><span className="inline-block size-1.5 rounded-full bg-[hsl(var(--brand-lime))]"></span>{f}</li>)}
                </ul>
                <Button className="mt-6 w-full">{p.cta}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot gallery */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Screenshots</h2>
          <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-3">
            {[...Array(6)].map((_,i)=> (
              <div key={i} className="group relative overflow-hidden rounded-xl border bg-card">
                <div className="aspect-video bg-gradient-to-br from-[hsl(var(--brand-lightblue))] via-[hsl(var(--brand-pink))] to-[hsl(var(--brand-blue))] transition group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">FAQ</h2>
          <div className="mx-auto mt-8 max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is there a free plan?</AccordionTrigger>
                <AccordionContent>Yes, get started free with limited monthly summaries.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Do you support dark mode?</AccordionTrigger>
                <AccordionContent>Yes. Use the toggle in the header — colors adapt to neon lime and purple on a black background.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I export my notes?</AccordionTrigger>
                <AccordionContent>Export as text, markdown, or slides. Team plan adds shared libraries.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 text-center">
            <h3 className="text-2xl font-bold">Join the newsletter</h3>
            <p className="mt-1 text-muted-foreground">Product updates and study tips, twice a month.</p>
            <form className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <input type="email" required placeholder="you@example.com" className="w-full rounded-md border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:max-w-sm" />
              <Button className="px-6">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-20">
        <div className="container text-center">
          <div className="mx-auto max-w-3xl rounded-2xl border bg-gradient-to-br from-[hsl(var(--brand-blue)/0.15)] via-[hsl(var(--brand-pink)/0.15)] to-[hsl(var(--brand-lime)/0.15)] p-10">
            <h3 className="text-2xl font-bold md:text-3xl">Ready to accelerate your learning?</h3>
            <p className="mt-2 text-muted-foreground">Start free. Upgrade anytime.</p>
            <Button asChild size="lg" className="mt-6 px-8"><Link to="/dashboard">Try Free Now</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
