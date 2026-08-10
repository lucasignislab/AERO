import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Plus,
    X,
    ChevronDown,
    MoreHorizontal,
    Search,
    Check,
    AlertTriangle,
    Info,
    CircleAlert,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Dados dos tokens — fonte da verdade: DESIGN_SYSTEM.md + globals.css */
/* ------------------------------------------------------------------ */

const brandStructureColors = [
    { name: "Primary", token: "bg-primary", hex: "#24262F", usage: "Fundo principal da aplicação (Body)." },
    { name: "Primary 10", token: "bg-primary-10", hex: "#1D1F26", usage: "Painéis (Sidebar), cards primários." },
    { name: "Primary 20", token: "bg-primary-20", hex: "#17181D", usage: "Inputs, dropdowns." },
    { name: "Primary 30", token: "bg-primary-30", hex: "#101115", usage: "Sombras profundas, bordas sutis." },
    { name: "Brand (Info)", token: "bg-brand", hex: "#388CFA", usage: "Ação principal (links, botões primários)." },
    { name: "Background", token: "bg-background", hex: "#0E1015", usage: "Fundo alternativo profundo." },
    { name: "Card", token: "bg-card", hex: "#1A1C23", usage: "Superfícies elevadas." },
];

const neutralColors = [
    { name: "Neutral", token: "text-neutral", hex: "#FFFFFF", usage: "Títulos, texto de alto contraste." },
    { name: "Neutral 10", token: "text-neutral-10", hex: "#F5F5F5", usage: "Texto do corpo principal." },
    { name: "Neutral 20", token: "text-neutral-20", hex: "#D4D4D4", usage: "Legendas, descrições secundárias." },
    { name: "Neutral 30", token: "text-neutral-30", hex: "#A3A3A3", usage: "Placeholders, ícones inativos." },
    { name: "Neutral 40", token: "text-neutral-40", hex: "#737373", usage: "Bordas desabilitadas." },
];

const feedbackColors = [
    { name: "Success", token: "bg-success", hex: "#18821C", usage: "Concluído, seguro, positivo." },
    { name: "Warning", token: "bg-warning", hex: "#A35A01", usage: "Atenção, pendente, cuidado." },
    { name: "Danger", token: "bg-danger", hex: "#911756", usage: "Erro, falha, ação destrutiva." },
    { name: "Info", token: "bg-info", hex: "#008E8E", usage: "Informativo, neutro." },
    { name: "Accent", token: "bg-accent", hex: "#535C91", usage: "Destaque secundário, badges, tags." },
];

const typeScale = [
    { role: "Display H1", size: "36px / 2.25rem", weight: "700", className: "text-4xl font-bold", lh: "1.2", sample: "Planeje na velocidade do pensamento" },
    { role: "H1 (Page Title)", size: "30px / 1.875rem", weight: "600", className: "text-3xl font-semibold", lh: "1.3", sample: "Dashboard do Projeto" },
    { role: "H2 (Section)", size: "24px / 1.5rem", weight: "600", className: "text-2xl font-semibold", lh: "1.3", sample: "Sprint Atual" },
    { role: "H3 (Card Title)", size: "20px / 1.25rem", weight: "600", className: "text-xl font-semibold", lh: "1.4", sample: "Atividade Recente" },
    { role: "Body (Default)", size: "16px / 1rem", weight: "400", className: "text-base", lh: "1.5", sample: "Gerencie tarefas, ciclos e módulos do seu projeto em um só lugar." },
    { role: "Small", size: "14px / 0.875rem", weight: "400", className: "text-sm", lh: "1.5", sample: "Última atualização há 2 horas" },
    { role: "Tiny / Label", size: "12px / 0.75rem", weight: "500", className: "text-xs font-medium", lh: "1.2", sample: "EM PROGRESSO" },
];

const spacingScale = [
    { name: "2px", rem: "0.125rem", cls: "p-0.5", px: 2, usage: "Espaçamento mínimo (ícones)." },
    { name: "4px", rem: "0.25rem", cls: "p-1", px: 4, usage: "Ajuste fino de alinhamento." },
    { name: "8px", rem: "0.5rem", cls: "p-2", px: 8, usage: "Padding interno de botões pequenos." },
    { name: "12px", rem: "0.75rem", cls: "p-3", px: 12, usage: "Padding interno de inputs." },
    { name: "16px", rem: "1rem", cls: "p-4", px: 16, usage: "Padding padrão de cards." },
    { name: "24px", rem: "1.5rem", cls: "p-6", px: 24, usage: "Margem entre seções." },
    { name: "32px", rem: "2rem", cls: "p-8", px: 32, usage: "Padding de containers grandes." },
    { name: "64px", rem: "4rem", cls: "p-16", px: 64, usage: "Margem de layout macro." },
];

const radiusScale = [
    { name: "sm", value: "0.125rem", cls: "rounded-sm", usage: "Badges, checkboxes." },
    { name: "md", value: "0.375rem", cls: "rounded-md", usage: "Botões, inputs." },
    { name: "lg", value: "0.5rem", cls: "rounded-lg", usage: "Cards, modais pequenos." },
    { name: "xl", value: "0.75rem", cls: "rounded-xl", usage: "Modais principais." },
    { name: "2xl", value: "1rem", cls: "rounded-2xl", usage: "Painéis flutuantes." },
];

const shadowScale = [
    { name: "shadow-sm", usage: "Elevação discreta, hover em itens." },
    { name: "shadow-md", usage: "Cards de conteúdo, dropdowns." },
    { name: "shadow-lg", usage: "Popovers, menus flutuantes." },
    { name: "shadow-xl", usage: "Modais, command palette." },
];

const summaryLinks = [
    { href: "#introducao", label: "Introdução" },
    { href: "#cores", label: "Cores" },
    { href: "#tipografia", label: "Tipografia" },
    { href: "#espacamento", label: "Espaçamento" },
    { href: "#shape", label: "Shape (Radius + Bordas)" },
    { href: "#sombras", label: "Sombras" },
    { href: "#iconografia", label: "Iconografia" },
    { href: "#efeitos", label: "Efeitos Especiais" },
    { href: "#botoes", label: "Showcase: Botões" },
    { href: "#badges", label: "Showcase: Badges" },
    { href: "#inputs", label: "Showcase: Inputs" },
    { href: "#outros", label: "Outros Componentes" },
    { href: "#governanca", label: "Governança" },
];

/* ------------------------------------------------------------------ */
/*  Componentes auxiliares da página                                    */
/* ------------------------------------------------------------------ */

function Section({
    id,
    title,
    source,
    children,
}: {
    id: string;
    title: string;
    source?: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-24 space-y-6">
            <div className="border-b border-primary-30 pb-4">
                <h2 className="text-2xl font-semibold text-neutral">{title}</h2>
                {source && (
                    <p className="text-xs text-neutral-30 mt-1">
                        Fonte da verdade: <code className="text-brand">{source}</code>
                    </p>
                )}
            </div>
            {children}
        </section>
    );
}

function ColorSwatch({
    name,
    token,
    hex,
    usage,
}: {
    name: string;
    token: string;
    hex: string;
    usage: string;
}) {
    return (
        <div className="bg-card rounded-lg border border-primary-30 overflow-hidden">
            <div
                className="h-16 w-full border-b border-primary-30"
                style={{ backgroundColor: hex }}
            />
            <div className="p-3 space-y-1">
                <p className="text-sm font-semibold text-neutral">{name}</p>
                <p className="text-xs text-neutral-30">
                    <code className="text-brand">{token}</code> · {hex}
                </p>
                <p className="text-xs text-neutral-30">{usage}</p>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Página                                                              */
/* ------------------------------------------------------------------ */

export default function DesignSystemPage() {
    return (
        <div className="space-y-16 pb-16">
            {/* Hero */}
            <div className="aurora-bg rounded-2xl border border-primary-30 p-8 md:p-12">
                <Badge variant="secondary" className="mb-4">
                    Documentação Viva · v1.0
                </Badge>
                <h1
                    className="text-neutral font-bold"
                    style={{
                        fontSize: "var(--font-size-display)",
                        lineHeight: "var(--line-height-heading)",
                    }}
                >
                    AERO Design System
                </h1>
                <p className="text-neutral-20 mt-3 max-w-2xl text-base">
                    O guia oficial de estilo e biblioteca de componentes do AERO.
                    Construído dark-first, combina densidade de informação com
                    interfaces limpas para planejar na velocidade do pensamento.
                    Esta página é renderizada com os próprios tokens{" "}
                    <code className="text-brand">--color-*</code> do projeto —
                    tudo aqui é fonte da verdade.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                    <Badge variant="outline">18 tokens de cor</Badge>
                    <Badge variant="outline">7 níveis tipográficos</Badge>
                    <Badge variant="outline">8 passos de espaçamento</Badge>
                    <Badge variant="outline">9 componentes UI</Badge>
                </div>
            </div>

            {/* Sumário */}
            <nav className="bg-card rounded-xl border border-primary-30 p-6">
                <h2 className="text-sm font-semibold text-neutral-30 uppercase tracking-wider mb-4">
                    Sumário
                </h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {summaryLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm text-neutral-20 hover:text-brand transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </nav>

            {/* Introdução */}
            <Section id="introducao" title="Introdução ao Estilo">
                <p className="text-neutral-20 text-base max-w-3xl">
                    A identidade do AERO é fundamentada em produtividade sem
                    fricção: um tema escuro permanente que reduz fadiga visual,
                    combinado com uma tipografia geométrica neutra. No produto,
                    isso se reflete em:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card rounded-xl border border-primary-30 p-6">
                        <h3 className="text-xl font-semibold text-neutral mb-2">
                            Dark-First
                        </h3>
                        <p className="text-sm text-neutral-20">
                            Superfícies em camadas — de{" "}
                            <code className="text-brand">primary</code> (#24262F)
                            ao profundo <code className="text-brand">background</code>{" "}
                            (#0E1015) — criam hierarquia sem bordas duras. A cor de
                            ação <code className="text-brand">brand</code> (#388CFA)
                            guia o olhar apenas para o que é interativo.
                        </p>
                    </div>
                    <div className="bg-card rounded-xl border border-primary-30 p-6">
                        <h3 className="text-xl font-semibold text-neutral mb-2">
                            Densidade com Respiro
                        </h3>
                        <p className="text-sm text-neutral-20">
                            Inter em pesos 400–700 para texto corrido e títulos,
                            espaçamento em múltiplos de 4px e radius suave (
                            <code className="text-brand">rounded-md</code>–
                            <code className="text-brand">2xl</code>) equilibram a
                            densidade de informação de boards, tabelas e timelines.
                        </p>
                    </div>
                </div>
            </Section>

            {/* Cores */}
            <Section id="cores" title="Cores" source="app/globals.css · DESIGN_SYSTEM.md §1">
                <p className="text-neutral-20 text-sm max-w-3xl">
                    Paleta semântica definida como variáveis CSS em{" "}
                    <code className="text-brand">:root</code> e exposta ao Tailwind
                    via <code className="text-brand">@theme inline</code>.
                    Componentes consomem estes tokens — nunca valores arbitrários.
                </p>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-neutral">
                        Marca e Estrutura{" "}
                        <span className="text-xs text-neutral-30 font-normal">
                            7 tokens · superfícies e ação
                        </span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {brandStructureColors.map((c) => (
                            <ColorSwatch key={c.name} {...c} />
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-neutral">
                        Texto e Conteúdo (Neutral){" "}
                        <span className="text-xs text-neutral-30 font-normal">
                            5 tokens · hierarquia de leitura
                        </span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {neutralColors.map((c) => (
                            <ColorSwatch key={c.name} {...c} />
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-neutral">
                        Feedback e Status{" "}
                        <span className="text-xs text-neutral-30 font-normal">
                            5 tokens · estados semânticos
                        </span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {feedbackColors.map((c) => (
                            <ColorSwatch key={c.name} {...c} />
                        ))}
                    </div>
                </div>
            </Section>

            {/* Tipografia */}
            <Section id="tipografia" title="Tipografia" source="DESIGN_SYSTEM.md §2">
                <div className="bg-card rounded-xl border border-primary-30 p-6 flex flex-col md:flex-row md:items-center gap-6">
                    <div>
                        <p className="text-xs text-neutral-30 uppercase tracking-wider">
                            Família
                        </p>
                        <p className="text-2xl font-semibold text-neutral mt-1">
                            Inter
                        </p>
                        <p className="text-sm text-neutral-30 mt-1">
                            Google Fonts · pesos 300, 400, 500, 600, 700
                        </p>
                    </div>
                    <p className="text-neutral-20 text-5xl md:ml-auto font-semibold">
                        Aa Bb Cc — 0123
                    </p>
                </div>

                <div className="bg-card rounded-xl border border-primary-30 divide-y divide-primary-30">
                    {typeScale.map((t) => (
                        <div
                            key={t.role}
                            className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 md:gap-6 items-baseline"
                        >
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-neutral">
                                    {t.role}
                                </p>
                                <p className="text-xs text-neutral-30">
                                    {t.size} · peso {t.weight} · lh {t.lh}
                                </p>
                                <p className="text-xs">
                                    <code className="text-brand">{t.className}</code>
                                </p>
                            </div>
                            <p className={`text-neutral ${t.className}`}>{t.sample}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Espaçamento */}
            <Section id="espacamento" title="Espaçamento" source="DESIGN_SYSTEM.md §3">
                <p className="text-neutral-20 text-sm max-w-3xl">
                    Baseado na escala de 4px do Tailwind. Use{" "}
                    <strong className="text-neutral">sempre</strong> múltiplos de 4.
                </p>
                <div className="bg-card rounded-xl border border-primary-30 divide-y divide-primary-30">
                    {spacingScale.map((s) => (
                        <div
                            key={s.name}
                            className="p-4 flex items-center gap-4"
                        >
                            <div className="w-32 shrink-0">
                                <p className="text-sm font-semibold text-neutral">
                                    {s.name}
                                </p>
                                <p className="text-xs text-neutral-30">
                                    {s.rem} · <code className="text-brand">{s.cls}</code>
                                </p>
                            </div>
                            <div
                                className="h-4 rounded-sm bg-brand shrink-0"
                                style={{ width: `${Math.max(s.px, 2)}px` }}
                            />
                            <p className="text-xs text-neutral-30 hidden md:block">
                                {s.usage}
                            </p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Shape */}
            <Section id="shape" title="Shape (Radius + Bordas)" source="DESIGN_SYSTEM.md §4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {radiusScale.map((r) => (
                        <div
                            key={r.name}
                            className="bg-card border border-primary-30 p-4 space-y-3 rounded-lg"
                        >
                            <div
                                className={`h-16 bg-primary-20 border border-brand/40 ${r.cls}`}
                            />
                            <div>
                                <p className="text-sm font-semibold text-neutral">
                                    radius.{r.name}
                                </p>
                                <p className="text-xs text-neutral-30">
                                    {r.value} · <code className="text-brand">{r.cls}</code>
                                </p>
                                <p className="text-xs text-neutral-30 mt-1">{r.usage}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-card rounded-xl border border-primary-30 p-6">
                    <h3 className="text-sm font-semibold text-neutral mb-3">
                        Bordas (Strokes)
                    </h3>
                    <div className="space-y-2 text-sm text-neutral-20">
                        <p>
                            <span className="inline-block w-24 text-neutral-30">Padrão:</span>
                            <code className="text-brand">border-primary-30</code> —
                            separadores e divisórias sutis.
                        </p>
                        <p>
                            <span className="inline-block w-24 text-neutral-30">Ativa:</span>
                            <code className="text-brand">border-brand</code> ou{" "}
                            <code className="text-brand">neutral-40</code> — foco e
                            estados ativos.
                        </p>
                    </div>
                </div>
            </Section>

            {/* Sombras */}
            <Section id="sombras" title="Sombras / Elevação">
                <p className="text-neutral-20 text-sm max-w-3xl">
                    Em tema escuro, elevação é comunicada principalmente por
                    superfícies mais claras; sombras reforçam camadas flutuantes.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-primary-20 rounded-xl border border-primary-30 p-6">
                    {shadowScale.map((s) => (
                        <div
                            key={s.name}
                            className={`bg-card rounded-lg border border-primary-30 p-4 ${s.name}`}
                        >
                            <p className="text-sm font-semibold text-neutral">
                                {s.name}
                            </p>
                            <p className="text-xs text-neutral-30 mt-1">{s.usage}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Iconografia */}
            <Section id="iconografia" title="Iconografia" source="DESIGN_SYSTEM.md §5">
                <div className="bg-card rounded-xl border border-primary-30 p-6 space-y-6">
                    <p className="text-sm text-neutral-20">
                        Biblioteca: <strong className="text-neutral">Lucide React</strong> ·
                        estilo Line (outline), stroke 2px (1.5px para ícones grandes).
                        Ícones herdam <code className="text-brand">currentColor</code> e
                        usam <code className="text-brand">text-neutral-30</code> quando inativos.
                    </p>
                    <div className="flex flex-wrap items-end gap-8">
                        <div className="text-center space-y-2">
                            <Plus className="w-4 h-4 text-neutral mx-auto" />
                            <p className="text-xs text-neutral-30">16px · w-4 h-4</p>
                        </div>
                        <div className="text-center space-y-2">
                            <Search className="w-5 h-5 text-neutral mx-auto" />
                            <p className="text-xs text-neutral-30">20px · w-5 h-5</p>
                        </div>
                        <div className="text-center space-y-2">
                            <ChevronDown className="w-6 h-6 text-neutral mx-auto" />
                            <p className="text-xs text-neutral-30">24px · w-6 h-6</p>
                        </div>
                        <div className="text-center space-y-2">
                            <MoreHorizontal className="w-5 h-5 text-neutral-30 mx-auto" />
                            <p className="text-xs text-neutral-30">inativo</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {[
                            { icon: <Plus className="w-4 h-4" />, label: "Adicionar / Criar" },
                            { icon: <X className="w-4 h-4" />, label: "Fechar / Remover" },
                            { icon: <ChevronDown className="w-4 h-4" />, label: "Dropdown / Menu" },
                            { icon: <MoreHorizontal className="w-4 h-4" />, label: "Menu de contexto" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-2 text-neutral-20 bg-primary-20 rounded-md border border-primary-30 px-3 py-2"
                            >
                                <span className="text-brand">{item.icon}</span>
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Efeitos */}
            <Section id="efeitos" title="Efeitos Especiais" source="app/globals.css · DESIGN_SYSTEM.md §6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="aurora-bg rounded-xl border border-primary-30 p-6 h-40 flex items-end">
                        <div>
                            <p className="text-sm font-semibold text-neutral">
                                Aurora Background
                            </p>
                            <p className="text-xs text-neutral-30">
                                <code className="text-brand">.aurora-bg</code> — gradiente
                                animado de 15s para áreas de destaque.
                            </p>
                        </div>
                    </div>
                    <div className="bg-card rounded-xl border border-primary-30 p-6 h-40 flex flex-col justify-end gap-2">
                        <button className="focus-ring bg-brand text-white rounded-md px-4 py-2 text-sm font-medium w-fit">
                            Tab até mim
                        </button>
                        <p className="text-xs text-neutral-30">
                            <code className="text-brand">.focus-ring</code> — outline brand
                            2px, offset 2px, respeita <code>focus-visible</code>.
                        </p>
                    </div>
                    <div className="bg-card rounded-xl border border-primary-30 p-6 h-40 flex flex-col justify-end gap-2">
                        <div className="flex gap-1 items-center">
                            <div className="w-2 h-8 rounded bg-primary-20" />
                            <div className="w-2 h-8 rounded" style={{ background: "hsl(235 24% 23%)" }} />
                        </div>
                        <p className="text-xs text-neutral-30">
                            Scrollbar customizada — 8px, track{" "}
                            <code className="text-brand">primary-20</code>, thumb
                            #2C2F47 com radius 4px.
                        </p>
                    </div>
                </div>
            </Section>

            {/* Showcase: Botões */}
            <Section id="botoes" title="Showcase: Botões" source="components/ui/button.tsx">
                <div className="bg-card rounded-xl border border-primary-30 p-6 space-y-8">
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-neutral">
                            Variantes
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button>Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="link">Link</Button>
                        </div>
                        <p className="text-xs text-neutral-30">
                            <code className="text-brand">default</code> usa bg-brand ·{" "}
                            <code className="text-brand">destructive</code> usa bg-danger ·
                            foco com ring brand 2px em todas.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-neutral">Tamanhos</h3>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button size="sm">Small · h-9</Button>
                            <Button size="default">Default · h-10</Button>
                            <Button size="lg">Large · h-11</Button>
                            <Button size="icon" aria-label="Adicionar">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-neutral">Estados</h3>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button>Normal / Hover interativo</Button>
                            <Button disabled>Disabled</Button>
                            <Button variant="outline" disabled>
                                Outline disabled
                            </Button>
                        </div>
                        <p className="text-xs text-neutral-30">
                            Disabled aplica <code className="text-brand">opacity-50</code> e{" "}
                            <code className="text-brand">pointer-events-none</code>.
                        </p>
                    </div>
                </div>
            </Section>

            {/* Showcase: Badges */}
            <Section id="badges" title="Showcase: Badges" source="components/ui/badge.tsx">
                <div className="bg-card rounded-xl border border-primary-30 p-6 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="success">
                            <Check className="w-3 h-3 mr-1" /> Concluído
                        </Badge>
                        <Badge variant="warning">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Pendente
                        </Badge>
                        <Badge variant="destructive">
                            <CircleAlert className="w-3 h-3 mr-1" /> Erro
                        </Badge>
                    </div>
                    <p className="text-xs text-neutral-30">
                        Radius pill (<code className="text-brand">rounded-full</code>),
                        texto <code className="text-brand">text-xs font-semibold</code>,
                        mapeados para os tokens de feedback.
                    </p>
                </div>
            </Section>

            {/* Showcase: Inputs */}
            <Section id="inputs" title="Showcase: Inputs" source="components/ui/input.tsx">
                <div className="bg-card rounded-xl border border-primary-30 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                        <div className="space-y-2">
                            <label className="text-sm text-neutral-20">
                                Default / interativo
                            </label>
                            <Input placeholder="Digite o nome da tarefa…" />
                            <p className="text-xs text-neutral-30">
                                Placeholder em neutral-30.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-neutral-20">Erro</label>
                            <Input
                                defaultValue="sprint"
                                className="border-danger focus-visible:ring-danger"
                                aria-invalid
                            />
                            <p className="text-xs" style={{ color: "#E06B9E" }}>
                                O preenchimento deste campo é obrigatório.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-neutral-20">Disabled</label>
                            <Input placeholder="Campo desabilitado" disabled />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-neutral-20">Com ícone</label>
                            <div className="relative">
                                <Search className="w-4 h-4 text-neutral-30 absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input placeholder="Buscar…" className="pl-9" />
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Outros componentes */}
            <Section id="outros" title="Outros Componentes" source="components/ui/">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card rounded-xl border border-primary-30 p-6 space-y-4">
                        <h3 className="text-sm font-semibold text-neutral">Checkbox</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm text-neutral-20">
                                <Checkbox defaultChecked /> Tarefa concluída
                            </label>
                            <label className="flex items-center gap-2 text-sm text-neutral-20">
                                <Checkbox /> Tarefa pendente
                            </label>
                            <label className="flex items-center gap-2 text-sm text-neutral-30">
                                <Checkbox disabled /> Indisponível
                            </label>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl border border-primary-30 p-6 space-y-4">
                        <h3 className="text-sm font-semibold text-neutral">Avatar</h3>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>LC</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarFallback>AE</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarFallback>+3</AvatarFallback>
                            </Avatar>
                        </div>
                        <p className="text-xs text-neutral-30">
                            Fallback com iniciais quando não há imagem.
                        </p>
                    </div>

                    <div className="bg-card rounded-xl border border-primary-30 p-6 space-y-4">
                        <h3 className="text-sm font-semibold text-neutral">Tooltip</h3>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Info className="w-4 h-4 mr-2" /> Passe o cursor
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Dica contextual sobre superfície escura.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="bg-card rounded-xl border border-primary-30 p-6 space-y-4">
                        <h3 className="text-sm font-semibold text-neutral">Skeleton</h3>
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-2/3" />
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-neutral-30">
                            Estado de carregamento que preserva o layout.
                        </p>
                    </div>
                </div>
            </Section>

            {/* Governança */}
            <Section id="governanca" title="Governança" source="DESIGN_SYSTEM.md §7">
                <div className="bg-card rounded-xl border border-primary-30 p-6">
                    <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-20">
                        <li>
                            Qualquer nova cor deve ser adicionada às variáveis CSS em{" "}
                            <code className="text-brand">app/globals.css</code> antes de
                            ser usada. Evite valores arbitrários (ex.:{" "}
                            <code className="text-danger" style={{ color: "#E06B9E" }}>
                                bg-[#123456]
                            </code>
                            ).
                        </li>
                        <li>
                            Use os tokens semânticos (
                            <code className="text-brand">bg-card</code>,{" "}
                            <code className="text-brand">text-neutral-20</code>, …) sempre
                            que possível para facilitar manutenção de temas futuros.
                        </li>
                        <li>
                            Componentes novos nascem em{" "}
                            <code className="text-brand">components/ui/</code> com
                            variantes via <code className="text-brand">cva</code> e devem
                            ser exibidos nesta página.
                        </li>
                    </ol>
                </div>
            </Section>
        </div>
    );
}
