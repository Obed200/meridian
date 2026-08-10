import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "seed");

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

async function fetchHeroImage(slug: string): Promise<string> {
  const filename = `${slug}.jpg`;
  const filePath = path.join(UPLOAD_DIR, filename);

  try {
    const res = await fetch(`https://picsum.photos/seed/${slug}/1600/900`);
    if (!res.ok) throw new Error(`status ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(filePath, buffer);
  } catch {
    const hue = Math.abs(
      slug.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    ) % 360;
    const { data, info } = await sharp({
      create: {
        width: 1600,
        height: 900,
        channels: 3,
        background: hslToRgb(hue, 45, 55),
      },
    })
      .jpeg()
      .toBuffer({ resolveWithObject: true });
    await fs.writeFile(filePath, data);
    void info;
  }

  return `/uploads/seed/${filename}`;
}

function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
}

type Locale = "RW" | "EN";

const categoriesData: Array<{ name: string; slug: string; locale: Locale; key: string | null }> = [
  // English
  { name: "World", slug: "world", locale: "EN", key: "world" },
  { name: "Politics", slug: "politics", locale: "EN", key: "politics" },
  { name: "Business", slug: "business", locale: "EN", key: "business" },
  { name: "Technology", slug: "technology", locale: "EN", key: "technology" },
  { name: "Sports", slug: "sports", locale: "EN", key: "sports" },
  { name: "Opinion", slug: "opinion", locale: "EN", key: "opinion" },
  { name: "Health", slug: "health", locale: "EN", key: "health" },
  { name: "Culture", slug: "culture", locale: "EN", key: "culture" },
  // Kinyarwanda
  { name: "Politiki", slug: "politiki", locale: "RW", key: "politics" },
  { name: "Ubuzima", slug: "ubuzima", locale: "RW", key: "health" },
  { name: "Ubukungu", slug: "ubukungu", locale: "RW", key: "business" },
  { name: "Imikino", slug: "imikino", locale: "RW", key: "sports" },
  { name: "Imyidagaduro", slug: "imyidagaduro", locale: "RW", key: null },
  { name: "Umuco", slug: "umuco", locale: "RW", key: "culture" },
  { name: "Ikoranabuhanga", slug: "ikoranabuhanga", locale: "RW", key: "technology" },
  { name: "Waruziko", slug: "waruziko", locale: "RW", key: null },
  { name: "Diaspora", slug: "diaspora", locale: "RW", key: null },
  { name: "Ibitekerezo", slug: "ibitekerezo", locale: "RW", key: "opinion" },
  { name: "Isi Dutuye", slug: "isi-dutuye", locale: "RW", key: "world" },
];

type Author = "editor1" | "editor2" | "editor3" | "editor4";

type PostSeed = {
  title: string;
  category: string;
  locale: Locale;
  excerpt: string;
  body: string;
  author: Author;
  featured?: boolean;
  daysAgo: number;
};

const englishPostsData: PostSeed[] = [
  {
    title: "Global Leaders Convene for Climate Summit Amid Rising Tensions",
    category: "world",
    locale: "EN",
    excerpt:
      "Delegates from over 100 nations gathered this week to negotiate a new framework for emissions reduction, as scientists warn the window for action is narrowing.",
    author: "editor1",
    featured: true,
    daysAgo: 0,
    body: `Delegates from more than 100 countries opened a high-stakes climate summit on Monday, tasked with negotiating a new framework for cutting global emissions before the end of the decade. The talks, held under heavy security, come after a summer of record-breaking heat waves across three continents.

Negotiators are divided over how to finance the transition away from fossil fuels in developing economies, with several nations pushing for a dedicated fund backed by wealthier countries. "We cannot ask nations that contributed least to this crisis to bear the heaviest burden," one delegation head told reporters outside the main conference hall.

Scientists briefing the summit warned that the current trajectory of emissions puts the world on pace to exceed key warming thresholds within the next fifteen years. Several island nations have called for binding, enforceable targets rather than voluntary pledges, arguing that past agreements have consistently fallen short.

Despite the tension, organizers say a draft agreement could be ready for signature by the end of the week. Observers note that even a modest deal would mark the first coordinated action of its kind since talks stalled two years ago.

The summit continues through the weekend, with a final plenary session expected to determine whether the framework becomes binding or remains a set of voluntary commitments.`,
  },
  {
    title: "Earthquake Relief Efforts Accelerate in Coastal Region",
    category: "world",
    locale: "EN",
    excerpt:
      "Aid convoys reached the hardest-hit villages this weekend, as international relief agencies scaled up operations following last week's magnitude 6.4 quake.",
    author: "editor2",
    daysAgo: 2,
    body: `Relief convoys reached the last of the hardest-hit coastal villages over the weekend, more than a week after a magnitude 6.4 earthquake displaced tens of thousands of residents. Local officials say the priority has now shifted from search and rescue to housing and clean water access.

International aid organizations have set up temporary shelters capable of housing several thousand people, while engineers assess which structures are safe enough to reoccupy. Aftershocks, though diminishing in frequency, have complicated efforts to stabilize damaged buildings.

"The first 72 hours were about finding survivors. Now it's about making sure people don't get sick from what comes next," said a field coordinator with one of the responding agencies.

Government officials have pledged a rebuilding fund, though residents in some of the more remote villages say aid has been slow to arrive. Roads leading into the mountainous interior remain partially blocked by landslides triggered by the quake.

Officials estimate the full rebuilding effort could take up to two years, with early recovery focused on restoring power and water infrastructure before winter.`,
  },
  {
    title: "Lawmakers Reach Compromise on Infrastructure Bill",
    category: "politics",
    locale: "EN",
    excerpt:
      "After months of gridlock, a bipartisan group has agreed on a package that funds transit, broadband, and grid modernization projects nationwide.",
    author: "editor1",
    daysAgo: 1,
    body: `A bipartisan group of lawmakers announced a compromise infrastructure package on Tuesday, ending months of gridlock over how to fund transit, broadband, and power grid upgrades. The deal narrowly avoids a procedural deadline that would have sent the bill back to committee.

The package allocates funding across three main areas: public transit expansion in mid-sized cities, rural broadband buildout, and modernization of an aging electrical grid increasingly strained by extreme weather. Negotiators say the final version trimmed roughly 15 percent from the original proposal to secure enough votes.

"This isn't the bill either side wanted, but it's the bill the country needs," said one of the lead negotiators at a press conference following the announcement.

Critics on both flanks have raised objections — some argue the funding levels remain insufficient, while others say the price tag is still too high. Leadership in both chambers expressed confidence the measure would clear a floor vote before the current session ends.

If passed, implementation would begin early next year, with states required to submit project proposals within the first two quarters of funding availability.`,
  },
  {
    title: "Election Officials Roll Out New Voter Verification System",
    category: "politics",
    locale: "EN",
    excerpt:
      "The updated system, piloted in three states this spring, aims to cut wait times while adding new layers of identity verification.",
    author: "editor2",
    daysAgo: 4,
    body: `Election officials in three states began rolling out a new voter verification system this week, designed to reduce polling-place wait times while adding additional identity-check safeguards. The system was piloted in a handful of counties during the spring primaries.

Officials say the new process cut average check-in time nearly in half during pilot testing, largely by digitizing steps that previously required paper lookups. Poll workers in pilot counties reported fewer bottlenecks during peak morning and evening hours.

Voting rights advocates have offered cautious support, while pressing for independent audits of the system's error rates, particularly for voters whose names or addresses have recently changed. State election boards say audit results from the pilot will be published before the system expands further.

Officials from the participating states say a broader rollout is planned ahead of next year's general election, pending final certification from independent election security reviewers.`,
  },
  {
    title: "Tech Giant Reports Record Quarterly Earnings",
    category: "business",
    locale: "EN",
    excerpt:
      "Strong cloud and advertising revenue pushed profits well past analyst expectations, sending shares higher in after-hours trading.",
    author: "editor1",
    daysAgo: 3,
    body: `A major technology company posted record quarterly earnings on Thursday, driven by stronger-than-expected growth in its cloud computing and advertising divisions. Shares rose sharply in after-hours trading following the announcement.

Revenue climbed well past analyst forecasts, with the company's cloud unit in particular posting its fastest growth in over two years. Executives credited increased enterprise demand for AI-related infrastructure as a key driver.

"We're seeing sustained demand across nearly every customer segment, not just the largest accounts," the company's chief financial officer told investors on an earnings call.

The results come amid a broader rally in technology stocks this quarter, as investors bet on continued enterprise spending despite broader economic uncertainty. Analysts noted the company's operating margins also improved, suggesting cost-control measures introduced earlier in the year are taking hold.

Looking ahead, leadership offered cautiously optimistic guidance for the coming quarter, while flagging currency fluctuations and regulatory scrutiny abroad as potential headwinds.`,
  },
  {
    title: "Central Bank Signals Pause in Interest Rate Hikes",
    category: "business",
    locale: "EN",
    excerpt:
      "Policymakers held rates steady for the second consecutive meeting, citing cooling inflation data and a softening labor market.",
    author: "editor2",
    daysAgo: 6,
    body: `The central bank held interest rates steady on Wednesday for the second consecutive meeting, signaling a pause after more than a year of aggressive tightening. Policymakers pointed to cooling inflation figures and early signs of a softening labor market as justification.

In its accompanying statement, the bank said it would continue to monitor incoming data closely before deciding on any further moves, leaving the door open to additional hikes if inflation proves more persistent than expected.

Markets responded positively to the announcement, with major indices closing higher as investors welcomed the signal of a less aggressive policy path. Bond yields eased slightly following the decision.

Economists remain divided on the timing of the bank's next move, with some forecasting a rate cut as early as next quarter and others cautioning that inflation could reaccelerate if energy prices climb further into the winter months.

The bank's next policy meeting is scheduled in roughly six weeks, by which point officials will have a fuller picture of holiday-season consumer spending data.`,
  },
  {
    title: "Startup Unveils Breakthrough in Battery Storage",
    category: "technology",
    locale: "EN",
    excerpt:
      "The company claims its new solid-state design could double the range of electric vehicles while cutting charging times significantly.",
    author: "editor1",
    daysAgo: 1,
    body: `A battery technology startup unveiled a new solid-state cell design this week that it claims could nearly double the effective range of electric vehicles while cutting charging times by more than half. Independent testing of the claims is still pending.

The company says its design replaces the liquid electrolyte found in conventional lithium-ion batteries with a solid material, reducing fire risk and allowing for denser energy storage. Executives say the technology is roughly three years from commercial-scale production.

"This is the kind of leap the industry has been chasing for over a decade," said the company's founder during a press demonstration at its research facility.

Several automakers have reportedly expressed early interest in licensing the technology, though no formal partnerships have been announced. Analysts caution that solid-state battery technology has seen previous breakthroughs fail to scale beyond the lab.

The startup says it plans to begin pilot production within eighteen months, with a small run of test vehicles slated for late next year.`,
  },
  {
    title: "Regulators Scrutinize AI Data Practices",
    category: "technology",
    locale: "EN",
    excerpt:
      "A new inquiry will examine how leading AI companies source and use training data, amid growing concern over consent and copyright.",
    author: "editor2",
    daysAgo: 5,
    body: `Regulators announced a formal inquiry this week into how major artificial intelligence companies source and use data to train their models, amid mounting concern from publishers, artists, and privacy advocates over consent and copyright.

The inquiry will require companies to disclose details about their training data pipelines, including whether copyrighted material was used without licensing agreements. Several publishers have already filed separate lawsuits alleging unauthorized use of their content.

Industry groups have pushed back, arguing that overly broad restrictions could slow innovation and put domestic companies at a disadvantage against international competitors operating under looser rules.

"We support clear rules, but they need to be workable," said a representative from one of the affected companies in a statement following the announcement.

The inquiry is expected to take several months, with regulators saying they may propose new disclosure requirements once findings are published.`,
  },
  {
    title: "Underdog Squad Clinches Championship in Dramatic Finish",
    category: "sports",
    locale: "EN",
    excerpt:
      "A last-minute comeback capped off a remarkable postseason run for a team that started the season near the bottom of the standings.",
    author: "editor1",
    daysAgo: 2,
    body: `A team that sat near the bottom of the standings just months ago completed one of the most dramatic championship runs in recent memory on Sunday night, rallying from a double-digit deficit to win the title in the final minutes.

The comeback capped an unlikely postseason run built on a stifling defense and a series of clutch performances from players who were largely unknown at the start of the season. Coaches credited a mid-season lineup change for sparking the turnaround.

"Nobody believed in this group except the guys in that locker room," the team's head coach said in a post-game interview, fighting back emotion.

Fans flooded the streets around the arena following the final whistle, capping off a season that began with modest expectations and ended in celebration. The championship is the franchise's first in over a decade.

Players credited the team's resilience through a string of midseason injuries as the turning point that ultimately defined the run.`,
  },
  {
    title: "City Breaks Ground on New Stadium Complex",
    category: "sports",
    locale: "EN",
    excerpt:
      "Construction begins on a multi-use venue expected to host major sporting events and concerts starting in three years.",
    author: "editor2",
    daysAgo: 7,
    body: `City officials broke ground Monday on a new multi-use stadium complex expected to host major sporting events, concerts, and community gatherings once complete. The project, years in planning, is slated to open in just under three years.

The venue will seat roughly 45,000 for sporting events and is designed to be reconfigured for concerts and other large gatherings. Officials say the project is being funded through a mix of public bonds and private investment.

Supporters argue the stadium will bring significant economic activity to the surrounding district, while some residents have raised concerns about construction noise and traffic during the build-out phase.

"This is about more than sports — it's an investment in the city's long-term economic future," the mayor said at the groundbreaking ceremony.

Construction crews expect the first phase, including the main structural framework, to be completed within eighteen months.`,
  },
  {
    title: "Why Local Journalism Still Matters",
    category: "opinion",
    locale: "EN",
    excerpt:
      "As national headlines dominate feeds, the slow erosion of local newsrooms leaves communities without anyone watching city hall.",
    author: "editor1",
    daysAgo: 3,
    body: `There is a version of the news cycle most people never see: the city council meeting that runs three hours past its scheduled end, the school board budget line nobody asks about, the zoning variance quietly approved on a Tuesday afternoon. For decades, it was local reporters who sat through those meetings so the rest of us didn't have to.

That coverage has been disappearing. Newsroom staffing at local outlets has fallen sharply over the past two decades, and entire counties across the country now have no dedicated local news source at all. What replaces it is often silence, or worse, an information vacuum filled by rumor and social media speculation.

This matters beyond nostalgia for the printed page. Research has repeatedly linked the loss of local news to lower voter turnout in local elections, less competitive races, and even higher municipal borrowing costs, as the absence of scrutiny reduces accountability.

None of this means national journalism doesn't matter — it clearly does. But the collapse of local newsrooms has left a gap that no amount of national coverage can fill, because no national outlet is going to send a reporter to your town's budget hearing.

Rebuilding that capacity won't be easy, and it likely won't look like the newsrooms of the past. But communities that lose the ability to watch their own institutions rarely get that ability back easily.`,
  },
  {
    title: "The Case for Rethinking Urban Transit",
    category: "opinion",
    locale: "EN",
    excerpt:
      "Cities that invested early in frequent, reliable bus service are seeing ridership gains that light rail alone never delivered.",
    author: "editor2",
    daysAgo: 8,
    body: `For years, transit planners treated buses as the consolation prize of public transportation — a stopgap for cities that couldn't afford rail. That thinking is increasingly out of step with the data.

Cities that have redesigned their bus networks around frequency rather than coverage — running buses every ten minutes on a smaller number of high-demand corridors instead of infrequent service on every street — have seen ridership climb substantially, often at a fraction of the cost of a single rail line.

The appeal is simple: reliability matters more to riders than mode. A bus that comes every eight minutes beats a train that comes every thirty, and it can be implemented in months rather than the decade-plus timelines that rail projects typically require.

None of this is an argument against rail entirely — dense corridors with enormous ridership demand still benefit from its capacity. But for most mid-sized cities weighing how to spend limited transit dollars, the evidence increasingly points toward frequency-first bus networks as the more pragmatic starting point.

The cities getting this right aren't necessarily spending more. They're spending differently — and their ridership numbers show it.`,
  },
  {
    title: "New Study Links Sleep Patterns to Long-Term Wellness",
    category: "health",
    locale: "EN",
    excerpt:
      "Researchers tracking over 10,000 adults found consistent sleep timing mattered more for long-term health outcomes than total hours slept.",
    author: "editor1",
    daysAgo: 4,
    body: `A large new study tracking more than 10,000 adults over several years has found that consistency in sleep timing may matter more for long-term health outcomes than the total number of hours slept each night.

Participants who went to bed and woke up at roughly the same time each day showed lower rates of cardiovascular issues and metabolic conditions compared to those with highly variable sleep schedules, even when total sleep duration was similar between the two groups.

"We've spent a lot of time focused on the eight-hour number, but timing regularity appears to be an independent factor," said one of the study's lead researchers.

The findings add to a growing body of research suggesting that circadian rhythm stability plays a significant role in long-term health, beyond simply logging enough hours of rest.

Researchers caution the study is observational and cannot fully establish cause and effect, but say the results support broader public health messaging around maintaining consistent sleep-wake schedules, particularly for shift workers and others with irregular routines.`,
  },
  {
    title: "Museum Unveils Landmark Exhibition on Modern Art",
    category: "culture",
    locale: "EN",
    excerpt:
      "The retrospective, five years in the making, brings together works rarely displayed outside private collections.",
    author: "editor2",
    daysAgo: 5,
    body: `A major museum opened a landmark retrospective this week, five years in the making, bringing together works spanning a pivotal era of modern art — many of which are rarely displayed outside private collections.

Curators say securing loans for the exhibition required years of negotiation with private collectors and institutions across multiple countries, some of whom had never before agreed to let the pieces travel.

"This is likely a once-in-a-generation opportunity to see these works in conversation with each other," the museum's chief curator said at a preview event ahead of the public opening.

The exhibition is organized thematically rather than chronologically, tracing how a handful of recurring ideas resurfaced across decades and movements. Early reviews have praised the ambition of the curatorial approach, though some critics note the density of the show may require multiple visits to fully absorb.

The exhibition is scheduled to run for four months before several pieces return to their lending institutions, with museum officials describing it as unlikely to be reassembled again in this configuration.`,
  },
];

const kinyarwandaPostsData: PostSeed[] = [
  {
    title: "Abadepite Bemeje Gahunda Nshya yo Kunoza Imihanda y'Icyaro",
    category: "politiki",
    locale: "RW",
    excerpt:
      "Umutwe w'Abadepite wemeje uyu munsi gahunda nshya izatuma imihanda y'icyaro inozwa mu myaka itatu iri imbere.",
    author: "editor3",
    daysAgo: 1,
    body: `Umutwe w'Abadepite wemeje ku wa gatatu gahunda nshya igamije kunoza imihanda y'icyaro mu turere twinshi tw'igihugu, nyuma y'ibiganiro byamaze amezi make hagati y'amashyaka atandukanye.

Gahunda ivuga ko mu myaka itatu iri imbere, hazubakwa cyangwa hanozwe ibirometero magana atandukanye by'imihanda, biteganyijwe ko bizatuma abaturage bo mu cyaro bagera vuba ku masoko no ku bitaro.

Abadepite bamwe bavuze ko bishimira iyi ntambwe ariko bakomeza gusaba ko amafaranga azakoreshwa mu buryo bugaragara, mu gihe abandi bibajije uburyo gahunda izashyirwa mu bikorwa mu turere dukennye cyane.

Minisiteri ifite imihanda mu nshingano zayo yavuze ko izatangira gukora igenzura ry'imihanda izasanwa mbere y'uko umwaka utaha utangira.`,
  },
  {
    title: "Inama Nkuru y'Igihugu Yiga ku Ivugurura ry'Amategeko y'Ubutaka",
    category: "politiki",
    locale: "RW",
    excerpt:
      "Abadepite n'abakozi ba Guverinoma bahuriye mu nama yiga uburyo bwo kuvugurura amategeko agenga ubutaka.",
    author: "editor4",
    daysAgo: 5,
    body: `Inama nkuru yateranye mu murwa mukuru iyobowe n'abayobozi bakuru b'igihugu, yiga ku ivugurura ry'amategeko agenga ubutaka, agamije gukemura impaka zimaze igihe kirekire hagati y'abaturage n'ibigo bishinzwe iyandikwa ry'ubutaka.

Abagize inama bavuze ko ivugurura rigamije koroshya uburyo abaturage bandikisha ubutaka bwabo, no kugabanya ibibazo by'impaka z'imbibi zikunze kugera ku manza.

Hazongerwaho kandi uburyo bw'ikoranabuhanga mu iyandikwa ry'ubutaka, kugira ngo raporo zigerweho vuba kandi zibashe kugenzurwa n'abaturage ubwabo binyuze kuri telefone zigendanwa.

Umushinga w'itegeko utegerejwe kuzajya mu Nteko Ishinga Amategeko mu mezi ari imbere, nyuma y'uko haboneka ibitekerezo by'abanyagihugu binyuze mu nama zizakorwa mu turere.`,
  },
  {
    title: "Ibitaro Byinshi Byahawe Ibikoresho Bishya byo Kuvura Abana",
    category: "ubuzima",
    locale: "RW",
    excerpt:
      "Minisiteri y'Ubuzima yatangaje ko ibitaro biri mu turere dutandukanye byahawe ibikoresho bishya bigamije kunoza ubuvuzi bw'abana bato.",
    author: "editor3",
    daysAgo: 2,
    body: `Minisiteri y'Ubuzima yatangaje ko ibitaro birenga makumyabiri byahawe ibikoresho bishya bigenewe kuvura abana bato, harimo n'ibikoresho byo kuvura impinja zivutse zidashyitse.

Abaganga bavuga ko ibi bikoresho bizatuma bagabanya umubare w'abarwayi bohererezwa mu bitaro binini bibarirwa kure, cyane cyane mu turere two mu cyaro aho ingendo z'ubuvuzi zikunze kutoroha.

Uretse ibikoresho, Minisiteri ivuga ko yiyemeje gukomeza gutoza abaforomo n'ababyeyi ku buryo bwo kwita ku bana bato mu buryo bwizewe, bikagabanya impfu z'abana batageze ku myaka itanu.

Ibi biba mu gihe igihugu gikomeje gushyira imbaraga mu bijyanye n'ubuzima bw'ababyeyi n'abana, nk'uko byemejwe mu ngamba za Guverinoma z'imyaka itanu iri imbere.`,
  },
  {
    title: "Ubushakashatsi Bwerekana Akamaro k'Imirire Myiza mu Bwiza bw'Ubwonko",
    category: "ubuzima",
    locale: "RW",
    excerpt:
      "Impuguke mu by'imirire zivuga ko kurya ibiryo birimo intungamubiri bihagije bishobora gufasha abana gukura neza mu bwenge no mu mubiri.",
    author: "editor4",
    daysAgo: 6,
    body: `Ubushakashatsi bushya bwakorewe mu bigo by'uburezi buto bwerekanye ko abana bafata ifunguro rirengeje intungamubiri bakunze kwigira neza kurusha abandi, harimo n'abagira ubushobozi buke bwo kwibuka.

Impuguke zisaba ababyeyi gushyira imbaraga ku ndyo zuzuye, ari nako zibutsa ko ibihingwa nk'amashaza n'imboga bishobora gufasha mu iterambere ry'ubwonko bw'umwana uko akura.

Muri iyi minsi, ibigo by'ubuzima biri kwiyongera mu turere byiyemeje gutanga inama ku babyeyi ku bijyanye n'imirire y'abana, cyane cyane mu myaka ibanza y'ubuzima bw'umwana.

Impuguke zikomeje gushishikariza abaturage gukoresha ibihingwa byo mu gihugu, bavuga ko biroroshye kandi bifite agaciro kangana n'ibindi biryo bitumizwa hanze.`,
  },
  {
    title: "Ishoramari mu Ikoranabuhanga Ryongera Akazi mu Mujyi wa Kigali",
    category: "ubukungu",
    locale: "RW",
    excerpt:
      "Ibigo bishya by'ikoranabuhanga byinjiye ku isoko byatangaje ko bizatanga akazi ku bantu babarirwa mu magana mu mwaka utaha.",
    author: "editor3",
    daysAgo: 1,
    body: `Ibigo bibiri bishya byibanda ku ikoranabuhanga byatangaje gahunda zo gushora imari mu mujyi wa Kigali, bivugwa ko bizashyiraho akazi gashya ku bantu barenga magana atatu mu mwaka utaha.

Abayobozi b'ibi bigo bavuze ko bahisemo Kigali kubera umutekano n'ibikorwa remezo byiza, ndetse n'ingamba za Guverinoma zishishikariza abashoramari mu bijyanye n'ikoranabuhanga.

Impuguke mu bukungu zishimira iyi ntambwe, ariko zikomeza gusaba ko hakorwa ingamba zo gutoza urubyiruko ubumenyi buhagije bwo gukora muri ibi bigo, kugira ngo akazi katazajya gusa ku bantu baturutse hanze.

Uretse guhanga akazi, ibi bigo byavuze ko byiteguye gufasha amashuri makuru mu mahugurwa afitanye isano n'ikoranabuhanga, mu rwego rwo kwiteza imbere urubyiruko rw'igihugu.`,
  },
  {
    title: "Igiciro cy'Ibiribwa Kigenda Gishira ku Masoko y'Igihugu",
    category: "ubukungu",
    locale: "RW",
    excerpt:
      "Abacuruzi n'abaguzi bemeza ko ibiciro by'ibiribwa fatizo byatangiye kugenda bigabanuka nyuma y'isarura ryiza mu gihembwe gishize.",
    author: "editor4",
    daysAgo: 7,
    body: `Ku masoko menshi yo mu gihugu, ibiciro by'ibiribwa fatizo nk'ibinyampeke n'imboga byatangiye kugabanuka, nyuma y'uko isarura ryagenze neza kubera imvura yagwye igihe.

Abaguzi bavuga ko biborohereje kwishyura amafaranga make kugira ngo bagure ibyo bakenera, mu gihe abahinzi na bo bemeza ko basanze isoko rifite igiciro gikwiye ku byo basaruye.

Nyamara, impuguke mu by'ubukungu zibutsa ko ibiciro bishobora kongera kuzamuka igihe cy'itumba, zisaba ko hashyirwaho uburyo bwo kubika neza umusaruro kugira ngo utangira gutakara.

Minisiteri ishinzwe ubuhinzi yavuze ko ikorana n'amakoperative y'abahinzi kugira ngo hubakwe ubwiherero bw'ibigega mu turere dutandukanye, bizafasha kubika umusaruro mu gihe cy'ibura.`,
  },
  {
    title: "Ikipe y'Igihugu Yitegura Amarushanwa Akomeye ku Mugabane",
    category: "imikino",
    locale: "RW",
    excerpt:
      "Abakinnyi b'ikipe y'igihugu bahagurukiye kwitoza mu bihe by'imvura, biteguye amarushanwa manini ateganyijwe mu mezi make aza.",
    author: "editor3",
    daysAgo: 2,
    body: `Ikipe y'igihugu y'umupira w'amaguru yatangiye amahugurwa akomeye mu rwego rwo kwitegura amarushanwa manini ateganyijwe kuzabera ku mugabane wa Afurika mu mezi make aza.

Umutoza mukuru yavuze ko itsinda rishya ryinjiwemo n'abakinnyi bakiri bato, bavuye mu masoko n'amashuri makuru, bavugwaho ubushobozi bwiza n'umuvuduko.

Abaharanira umukino bemeza ko iki gihe ari cyo cyiza cyo kongera icyizere kuri iyi kipe, nyuma y'ibihe bike biheruka byagoye aho itsinda ryananiwe kwinjira mu marushanwa amwe akomeye.

Amarushanwa ateganyijwe gutangira mu mpera z'umwaka, kandi abaharanira uyu mukino biteze kubona ikipe y'igihugu ikina mu maso y'abafana benshi baturutse mu gihugu no hanze yacyo.`,
  },
  {
    title: "Urubyiruko Rwiga Imikino Itandukanye mu Ishuri ry'Impanuka",
    category: "imikino",
    locale: "RW",
    excerpt:
      "Ishuri rishya ryigisha imikino ryafunguwe mu murwa mukuru rigamije guteza imbere impano z'urubyiruko mu bijyanye n'imikino itandukanye.",
    author: "editor4",
    daysAgo: 8,
    body: `Ishuri rishya ryigisha imikino ryafunguwe mu mujyi wa Kigali, rihuriza hamwe abana n'urubyiruko bafite impano mu mikino nk'umupira w'amaguru, umupira w'ikapa, n'imbaraga z'amaboko.

Abarwanashyaka mu iterambere ry'umukino bavuga ko iri shuri rizafasha kumenya impano z'abana kuva bakiri bato, bikagabanya igihe cyo gushakisha abakinnyi b'ejo hazaza mu buryo butunganye.

Ababyeyi bamwe bashimye iyi gahunda, bavuga ko itanga umwanya urubyiruko rwabo rwo gukoresha umwanya wabo neza mu gihe kitari mu ishuri, aho gukoresha igihe kinini kuri telefone.

Ishuri rivuga ko rifite gahunda zo kuzamura ubushobozi bw'abatoza mu turere twose tw'igihugu, kugira ngo urubyiruko rwose rugire uburyo bumwe bwo kugera ku mahirwe.`,
  },
  {
    title: "Ikoranabuhanga rya Terefone Rifasha Abahinzi Kumenya Ibiciro by'Isoko",
    category: "ikoranabuhanga",
    locale: "RW",
    excerpt:
      "Porogaramu nshya yo kuri telefone igendanwa ifasha abahinzi kumenya ibiciro by'ibihingwa ku masoko atandukanye mbere y'uko bagenda kubigurisha.",
    author: "editor3",
    daysAgo: 3,
    body: `Ikigo cy'ikoranabuhanga cyashyize ahagaragara porogaramu nshya igenewe kuri telefone zigendanwa, izafasha abahinzi kumenya ibiciro by'ibihingwa byabo ku masoko atandukanye mbere y'uko bagenda kubigurisha.

Iyi porogaramu ikoresha amakuru ava mu masoko menshi, bikagabanya uburyo abaguzi bamwe bakoresha kugura umusaruro w'abahinzi ku giciro gito, kubera ko abahinzi babuze aho babona amakuru.

Abahinzi bagerageje iyi porogaramu bavuze ko yabafashije kubona amasoko meza kandi bakabona n'igihe nyacyo cyo kohereza umusaruro, bituma batakaza bike.

Abashyize ahagaragara iyi porogaramu bavuze ko biteguye kuyongeramo ururimi rw'Ikinyarwanda mu buryo bworoshye, kugira ngo abahinzi batize gukoresha ibikoresho by'ikoranabuhanga babashe kuyikoresha.`,
  },
  {
    title: "Amashuri Yinjiza Ikoranabuhanga mu Nyigisho z'Isomo rya Siyanse",
    category: "ikoranabuhanga",
    locale: "RW",
    excerpt:
      "Amashuri menshi yisumbuye atangiye gukoresha mudasobwa n'ibikoresho by'ikoranabuhanga mu kwigisha isomo rya siyansi n'imibare.",
    author: "editor4",
    daysAgo: 9,
    body: `Amashuri yisumbuye menshi mu gihugu yatangiye kwinjiza ikoranabuhanga mu nyigisho z'isomo rya siyansi n'imibare, bikaba biteganyijwe ko bizafasha abanyeshuri gusobanukirwa neza ibyigwa bigoye.

Abarimu bavuga ko gukoresha amashusho n'imyigire ikoresha mudasobwa bituma abanyeshuri bakurikirana amasomo neza kurusha uko byari bimeze mbere, cyane cyane mu byiciro biva mu bumenyi bwa fiziki na shimi.

Minisiteri y'Uburezi yavuze ko iki gikorwa kizakomeza gutera imbere, hakazashyirwaho amasomo y'ikoranabuhanga mu mashuri menshi mu myaka itatu iri imbere.

Nyamara, hakiri ibibazo by'amashanyarazi n'interineti idahagije mu duce twinshi two mu cyaro, ibintu abategura gahunda bavuga ko bakomeje kubikoraho ingamba.`,
  },
  {
    title: "Umuganura Wizihijwe mu Rwego rwo Gushimira Umusaruro",
    category: "umuco",
    locale: "RW",
    excerpt:
      "Abaturage bo mu duce dutandukanye biyunze ku munsi w'umuganura, aho bishimiye umusaruro w'umwaka kandi bagasangira ibiryo by'igihugu.",
    author: "editor3",
    daysAgo: 4,
    body: `Abaturage bo mu turere twinshi biyunze hamwe ku munsi w'umuganura, umuhango w'umuco gakondo ugaragaza gushimira umusaruro w'umwaka, aho batambutsa ibihingwa byabo mbere yo gutangira kubirya.

Abakuru b'imiryango bavuze ko uyu muhango ari umwe mu iy'agaciro gakomeye mu muco Nyarwanda, kubera ko ubumbatira ubumwe hagati y'abaturage kandi ukibutsa urubyiruko akamaro k'ubuhinzi.

Muri ibi biganiro, abari mu muhango birabiye kandi bemezanya ku bikorwa by'iterambere byakozwe mu mwaka ushize, aho bagirana ubushishozi ku bizakorwa mu myaka iri imbere.

Ibirori byari birimo indirimbo n'imbyino gakondo, aho urubyiruko rwafashe uruhare runini mu kwerekana umuco nyarwanda ku bashyitsi baturutse mu duce dutandukanye tw'igihugu.`,
  },
  {
    title: "Ikigo cy'Umuco Cyafunguye Insanganyamatsiko ku Buhanzi bw'Abakobwa",
    category: "umuco",
    locale: "RW",
    excerpt:
      "Insanganyamatsiko nshya yerekana ubuhanzi bw'abakobwa yafunguwe mu ikigo cy'umuco, igizwe n'amashusho, ibicapo n'ibikorwa by'ubuhanzi.",
    author: "editor4",
    daysAgo: 10,
    body: `Ikigo cy'umuco cyafunguye insanganyamatsiko nshya igaragaza ubuhanzi bw'abakobwa bo mu bihe bitandukanye, ihuriza hamwe amashusho, ibicapo, n'ibikorwa by'ubuhanzi biva mu turere dutandukanye tw'igihugu.

Abahanzi bagize uruhare muri iyi nsanganyamatsiko bavuze ko bishimiye kubona umwanya wo kwerekana ubuhanga bwabo, banavuga ko ibi bizafasha abandi bakobwa gukurikira inzira y'ubuhanzi nta bwoba.

Insanganyamatsiko izamara amezi abiri, kandi abayishinze bavuze ko biteguye kuyimurira mu tundi turere tw'igihugu nyuma y'uko igaragajwe mu murwa mukuru.

Abasuye iyi nsanganyamatsiko bavuze ko ari intambwe nziza mu kongera agaciro k'ubuhanzi bwo mu gihugu, cyane cyane mu gihe abenshi bakunze kwibanda gusa ku bihangano biva hanze.`,
  },
  {
    title: "Umuziki Nyarwanda Utangiye Kumenyekana ku Isoko Mpuzamahanga",
    category: "imyidagaduro",
    locale: "RW",
    excerpt:
      "Abahanzi bo mu gihugu bavuga ko indirimbo zabo zitangiye kwakirwa neza ku masoko y'imyidagaduro yo hanze, biturutse ku ikoranabuhanga rya interineti.",
    author: "editor3",
    daysAgo: 3,
    body: `Abahanzi benshi bo mu gihugu bavuga ko indirimbo zabo zitangiye kumenyekana no hanze y'igihugu, bishimira ko amaplatform y'umuziki ku interineti yabafashije kugera ku bumva batari babona mbere.

Bamwe muri aba bahanzi bavuze ko batangiye guhabwa ubutumire bwo gukina mu birori byo hanze y'igihugu, ibyo bakomeje kubona nk'intambwe ikomeye mu mwuga wabo.

Impuguke mu by'imyidagaduro zivuga ko iyi ntambwe ishobora gufasha n'urundi rubyiruko rufite impano, zibasaba gukomeza kwihangana no gushora imbaraga mu bicishije kuri interineti.

Uretse umuziki, ibindi bice by'imyidagaduro nka filime na firime ngufi na byo bivugwa ko bigenda byiyongera, aho abakinnyi b'igihugu batangiye gukorana n'abakora filime bo mu bihugu duturanye.`,
  },
  {
    title: "Waruziko: Amateka y'Umuganura n'Icyo Usobanuye Muri Iki Gihe",
    category: "waruziko",
    locale: "RW",
    excerpt:
      "Waruziko ko umunsi w'umuganura wagiraga insobanuro zitandukanye mu bihe bya kera kurusha uko usobanuwe muri iki gihe?",
    author: "editor4",
    daysAgo: 6,
    body: `Waruziko ko mu bihe bya kera, umunsi w'umuganura wari umunsi ukomeye cyane mu buzima bw'igihugu, aho wari uhuza umuco n'ubuyobozi, mbere y'uko usigara ari umunsi wibanda cyane ku muco n'umuryango?

Mu myaka ya vuba aha, uyu munsi wagumanye agaciro ko gushimira umusaruro, ariko insobanuro zawo zarahindutse gato uko ibihe byagiye bisimburana, kubera impinduka mu buzima bw'abaturage.

Abashakashatsi mu by'amateka bavuga ko kwiga ku nkomoko y'imihango nk'iyi bifasha abakiri bato gusobanukirwa neza uburyo umuco wabo wagiye uhindagurika, aho gukomeza kuwufata nk'ikintu kitigeze kigira impinduka.

Iki gice cya Waruziko kizagenda kigaragaza andi makuru ku mateka n'imico by'igihugu, agamije gufasha abasomyi kumenya byinshi ku nkomoko y'ibyo dukora buri munsi.`,
  },
  {
    title: "Abanyarwanda bo mu Mahanga Bahurira mu Nama y'Ubufatanye",
    category: "diaspora",
    locale: "RW",
    excerpt:
      "Abanyarwanda batuye mu bihugu bitandukanye bahuriye mu nama igamije gushimangira umubano n'igihugu cyabo kandi bakungurana ibitekerezo ku ishoramari.",
    author: "editor3",
    daysAgo: 5,
    body: `Abanyarwanda batuye mu bihugu byinshi bahuriye mu nama y'ubufatanye yateguwe n'imiryango y'Abanyarwanda bo mu mahanga, aho bunguranye ibitekerezo ku buryo bushobora gufasha igihugu cyabo mu iterambere.

Muri iyi nama, abitabiriye bavuze ko bashishikajwe no gushora imari mu bikorwa bito n'ibinini byo mu gihugu, harimo ubuhinzi, ikoranabuhanga, n'ubukerarugendo.

Abayobozi bahagarariye Guverinoma bavuze ko hazashyirwaho uburyo bworoshye bwo gufasha Abanyarwanda bo hanze mu bijyanye n'ishoramari, harimo no koroshya inzira z'impapuro zisabwa.

Abahuye muri iyi nama bemeranyijwe ko bazakomeza guhuriramo buri mwaka, kugira ngo bagenzure aho ibyemezo byafashwe bigeze, banagire uruhare mu kuzana ubumenyi bwabonye mu mahanga.`,
  },
  {
    title: "Igitekerezo: Uburezi bw'Ikinyarwanda Bugomba Gushimangirwa mu Mashuri",
    category: "ibitekerezo",
    locale: "RW",
    excerpt:
      "Kuvugana ururimi rw'ikinyarwanda mu ishuri bifite akamaro kanini ku kwiga kw'umwana, ariko ntibigomba gusimbura indimi z'amahanga.",
    author: "editor4",
    daysAgo: 4,
    body: `Ikibazo cy'ururimi rukoreshwa mu myigire kirakomeje kuvugwaho impaka, ariko birashoboka gushyira ku ruhande abandi urwo ni uko umwana yiga neza iyo yigishijwe mu rurimi arumva neza kurusha izindi.

Ababyeyi benshi bemeza ko umwana wiga mbere mu rurimi rw'ikinyarwanda, akaza kwiga izindi ndimi nyuma buhoro buhoro, agira ubushobozi bwo gusobanukirwa neza ibyigwa kurusha uwatangiye n'ururimi atazi neza.

Ariko iki gitekerezo ntikivuze ko indimi z'amahanga zitagira akamaro; ahubwo bisaba uburyo bunoze bwo guhuza indimi zombi, aho ikinyarwanda kizakoreshwa nk'urufatiro mbere yo kwinjiza izindi ndimi mu buryo bugenda butera imbere.

Iyi mvugo ntabwo ari ubwenge bushya, ariko ikibazo kigaragara ni uko gushyira mu bikorwa bikiri bike mu mashuri amwe, aho amasomo menshi akikigishwa mu ndimi abanyeshuri batumva neza kuva mu byiciro bito.`,
  },
  {
    title: "Igitekerezo: Guteza Imbere Ubukerarugendo bw'Imbere mu Gihugu",
    category: "ibitekerezo",
    locale: "RW",
    excerpt:
      "Mbere yo gukurura abashyitsi baturutse hanze, twagombye gushishikariza Abanyarwanda ubwabo gusura ahantu heza h'igihugu cyabo.",
    author: "editor3",
    daysAgo: 9,
    body: `Igihe kinini, ubukerarugendo bwibanda cyane ku bashyitsi baturutse mu bindi bihugu, mu gihe Abanyarwanda benshi batazi neza ubwiza bw'ahantu bakikije nk'ibiyaga, imisozi, cyangwa amashyamba.

Kwishyiriraho ibiciro byoroheje ku baturage bo mu gihugu byatuma benshi bagenda basura izo mbuga, bagatanga n'ubuhamya bufasha abandi kuzabizamo umutima.

Ubu bukerarugendo bw'imbere mu gihugu bufite kandi akamaro ku bukungu, kuko amafaranga aguzwa ku baturage agumana mu gihugu, bikanafasha ibigo bito byo mu turere gukomeza gukora.

Byaba byiza ibigo bishinzwe ubukerarugendo bikoranye n'amashuri, kugira ngo abanyeshuri babone amahirwe yo gusura ahantu hakomeye mu gihugu cyabo mbere yo kurangiza amashuri, bikagira uruhare mu kubaka urukundo rw'igihugu.`,
  },
  {
    title: "Abakuru b'Ibihugu bya Afurika y'Iburasirazuba Bateraniye ku Nama y'Ubufatanye",
    category: "isi-dutuye",
    locale: "RW",
    excerpt:
      "Abakuru b'ibihugu bigize umuryango w'Afurika y'Iburasirazuba bahuriye mu nama igamije guteza imbere ubucuruzi n'ubufatanye hagati y'ibihugu bahuriramo.",
    author: "editor4",
    featured: true,
    daysAgo: 0,
    body: `Abakuru b'ibihugu bigize umuryango w'Afurika y'Iburasirazuba bahuriye mu nama y'agaciro yiga ku buryo bwo koroshya ubucuruzi hagati y'ibihugu byabo, harimo no gukuraho imbogamizi zibangamira ubwikorezi ku mipaka.

Muri iyi nama, abari bahagarariye ibihugu byemeranyijwe ku gushyiraho gahunda zizatuma ibicuruzwa byambukiranya imipaka byihuta, bavuga ko ibi bizafasha kongera ubukungu bw'akarere kose.

Impuguke mu bukungu zishimira izi ngamba, ariko zibutsa ko gushyira mu bikorwa ibyemejwe bisaba imbaraga zihagije, kandi ko ibihugu bigomba gufatanya nyuma y'inama kugira ngo intego zigerweho.

Iyi nama izwi nk'iy'ubufatanye ikaba yarahuje kandi abikorera ku giti cyabo n'abashoramari, bagiye bunguranaho ibitekerezo ku miradi izashobora kwifashishwa n'akarere kose mu myaka iri imbere.`,
  },
  {
    title: "Ibihugu Byinshi Byiyemeje Kurwanya Imihindagurikire y'Ikirere Hamwe",
    category: "isi-dutuye",
    locale: "RW",
    excerpt:
      "Mu nama mpuzamahanga yateranye vuba, ibihugu byinshi byemeranyijwe gushyiraho ingamba rusange zo kugabanya ingaruka z'imihindagurikire y'ikirere.",
    author: "editor3",
    daysAgo: 8,
    body: `Abahagarariye ibihugu byinshi bahuriye mu nama mpuzamahanga yiga ku ngaruka z'imihindagurikire y'ikirere, aho bemeranyijwe gushyiraho ingamba rusange zizafasha kugabanya ubushyuhe bukabije bugenda bwiyongera ku isi.

Impuguke zavuze ko ibihugu bito, cyane cyane ibiri muri Afurika, ari byo bihura n'ingaruka nyinshi z'imihindagurikire y'ikirere, mu gihe atari byo byatangije ikibazo mu buryo bunini.

Ku bw'ibyo, hasabwe ko ibihugu byateye imbere byungura ubufasha ibihugu bito mu bijyanye n'ikoranabuhanga rifasha guhangana n'ibiza nk'amapfa n'imyuzure ikunze kugaragara muri iki gihe.

Inama yasojwe basezeranya kongera guhurira mu mwaka utaha, aho bazasuzuma aho ibyemejwe muri iyi nama bigeze, kandi bakemeza andi mahame mashya niba bikenewe.`,
  },
];

const postsData: PostSeed[] = [...englishPostsData, ...kinyarwandaPostsData];

async function main() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  await prisma.pageView.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categories = await Promise.all(
    categoriesData.map((c) => prisma.category.create({ data: c }))
  );
  const categoryByKey = new Map(categories.map((c) => [`${c.locale}:${c.slug}`, c]));

  const [adminPasswordHash, editor1PasswordHash, editor2PasswordHash, editor3PasswordHash, editor4PasswordHash] =
    await Promise.all([
      bcrypt.hash("Admin123!", 10),
      bcrypt.hash("Editor123!", 10),
      bcrypt.hash("Editor123!", 10),
      bcrypt.hash("Editor123!", 10),
      bcrypt.hash("Editor123!", 10),
    ]);

  const admin = await prisma.user.create({
    data: {
      name: "Alex Morgan",
      email: "admin@meridianpost.local",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const editor1 = await prisma.user.create({
    data: {
      name: "Jordan Lee",
      email: "editor1@meridianpost.local",
      passwordHash: editor1PasswordHash,
      role: "EDITOR",
    },
  });

  const editor2 = await prisma.user.create({
    data: {
      name: "Sam Rivera",
      email: "editor2@meridianpost.local",
      passwordHash: editor2PasswordHash,
      role: "EDITOR",
    },
  });

  const editor3 = await prisma.user.create({
    data: {
      name: "Uwase Diane",
      email: "editor3@meridianpost.local",
      passwordHash: editor3PasswordHash,
      role: "EDITOR",
    },
  });

  const editor4 = await prisma.user.create({
    data: {
      name: "Ndayisenga Eric",
      email: "editor4@meridianpost.local",
      passwordHash: editor4PasswordHash,
      role: "EDITOR",
    },
  });

  const authorsById = { editor1, editor2, editor3, editor4 };
  void admin;

  for (const post of postsData) {
    const slug = slugify(post.title);
    const heroImage = await fetchHeroImage(`${post.locale.toLowerCase()}-${slug}`);
    const category = categoryByKey.get(`${post.locale}:${post.category}`)!;
    const author = authorsById[post.author];
    const publishedAt = new Date();
    publishedAt.setDate(publishedAt.getDate() - post.daysAgo);

    await prisma.post.create({
      data: {
        title: post.title,
        slug,
        locale: post.locale,
        excerpt: post.excerpt,
        body: post.body,
        heroImage,
        heroImageAlt: post.title,
        status: "PUBLISHED",
        featured: post.featured ?? false,
        authorId: author.id,
        categoryId: category.id,
        publishedAt,
      },
    });
  }

  console.log("Seed complete.");
  console.log("Admin login:  admin@meridianpost.local / Admin123!");
  console.log("Editor login: editor1@meridianpost.local / Editor123! (EN desk)");
  console.log("Editor login: editor2@meridianpost.local / Editor123! (EN desk)");
  console.log("Editor login: editor3@meridianpost.local / Editor123! (RW desk)");
  console.log("Editor login: editor4@meridianpost.local / Editor123! (RW desk)");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
