"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import NewsCard from '@/components/NewsCard';

type Language = 'es' | 'eu' | 'en';

type NewsItem = {
  title: string;
  date: string;
  source: string;
  url: string;
  excerpt: string;
  logoSrc: string;
};

type BlogPage = {
  title: string;
  subtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
  readArticle: string;
  items: NewsItem[];
};

const blogContent: Record<Language, BlogPage> = {
  es: {
    title: 'Blog',
    subtitle: 'Recopilamos menciones en prensa y artículos sobre Ametsgoien.',
    ctaTitle: '¿Quieres ponerte en contacto con nosotros?',
    ctaSubtitle: 'Si eres medio de comunicación o quieres compartir una publicación sobre el proyecto, escríbenos desde la página de contacto.',
    ctaButton: 'Ir a contacto',
    readArticle: 'Leer artículo',
    items: [
      {
        title: 'Ametsgoien: el sueño solidario de Aitor y Josu en Orduña',
        date: '09/12/2025',
        source: 'Cadena Ser',
        logoSrc: '/cadenaser.png',
        url: 'https://cadenaser.com/euskadi/2025/12/09/ametsgoien-el-sueno-solidario-de-aitor-y-josu-en-orduna-que-abrira-un-hogar-para-mujeres-migradas-con-sus-hijos-en-2026-radio-bilbao/',
        excerpt: 'Reportaje sobre el origen del proyecto y el hogar que abrirá sus puertas para mujeres migradas y sus hijos en 2026.'
      },
      {
        title: 'Ametsgoien en TVE',
        date: '23/01/2026',
        source: 'TVE',
        logoSrc: '/tve.png',
        url: 'https://www.rtve.es/play/videos/telenorte-pais-vasco/orduna-amets-goien/16907765/',
        excerpt: 'Pieza televisiva sobre la asociación y su labor en Orduña.'
      },
      {
        title: 'Así es Ametsgoien',
        date: '26/02/2026',
        source: 'Radio Nervión',
        logoSrc: '/radionervion.png',
        url: 'https://www.radionervion.com/2026/02/26/asi-es-ametsgoien-de-una-iniciativa-familiar-a-un-proyecto-social-y-de-acogida-en-orduna/',
        excerpt: 'Entrevista y contexto sobre la evolución desde una iniciativa familiar hasta un proyecto social de acogida.'
      },
      {
        title: 'Casa de Orduña convertida en refugio',
        date: '27/02/2026',
        source: 'El Correo',
        logoSrc: '/elcorreo.png',
        url: 'https://www.elcorreo.com/bizkaia/nervion/casa-orduna-convertida-refugio-mujeres-hijos-20260227183819-nt.html#goog_rewarded',
        excerpt: 'Cobertura de prensa sobre el refugio abierto en Orduña para mujeres y niños.'
      },
      {
        title: 'Ametsgoien: queremos un mundo mejor',
        date: '01/03/2026',
        source: 'DEIA',
        logoSrc: '/deia.png',
        url: 'https://www.deia.eus/gente/2026/03/01/ametsgoien-queremos-mundo-mejor-encontramos-10763118.html',
        excerpt: 'Reportaje sobre la misión de la asociación y sus primeros pasos.'
      },
      {
        title: 'Cobertura en Onda Vasca',
        date: '01/03/2026',
        source: 'Onda Vasca',
        logoSrc: '/ondavasca.png',
        url: 'https://www.ondavasca.com/ametsgoien-queremos-dejar-este-mundo-un-poco-mejor-de-como-lo-encontramos/',
        excerpt: 'Emisión centrada en el impacto comunitario del proyecto.'
      },
      {
        title: 'Ametsgoien nace en Orduña',
        date: '02/03/2026',
        source: 'Aiaraldea',
        logoSrc: '/aiaraldea.png',
        url: 'https://aiaraldea.eus/urduna/1772486135053-ametsgoien-jaio-da-emakume-migratuentzako-urdunako-aterpea',
        excerpt: 'Noticia local sobre el nacimiento de la asociación.'
      },
      {
        title: 'Ametsgoien abre sus puertas',
        date: '11/03/2026',
        source: 'Radio Llodio',
        logoSrc: '/radionervion.png',
        url: 'https://radiollodio.com/2026/03/11/ametsgoien-abre-sus-puertas-en-orduna/',
        excerpt: 'Breve pieza radiofónica sobre la apertura del proyecto.'
      },
      {
        title: 'Un hogar en Orduña para mujeres con hijos',
        date: '18/03/2026',
        source: 'El Mundo Empresarial',
        logoSrc: '/elmundoempresarial.png',
        url: 'https://elmundoempresarial.info/2026/03/18/ametsgoien-un-hogar-en-orduna-para-mujeres-con-hijas-e-hijos-en-situacion-de-vulnerabilidad/responsabilidad-social/',
        excerpt: 'Cobertura en prensa empresarial sobre responsabilidad social y el proyecto.'
      },
      {
        title: 'Mención en podcast de Onda Cero',
        date: '01/04/2026',
        source: 'Onda Cero',
        logoSrc: '/ondacero.png',
        url: 'https://www.ondacero.es/podcast/emisoras/bilbao/brujula-euskadi/brujula-euskadi-01042026_2026040169cd58f40c3ff85f327286f0.html',
        excerpt: 'Mención en un programa regional de podcast.'
      },
      {
        title: 'Ametsik Goienak betetzeko grina',
        date: '09/04/2026',
        source: 'Aiaraldea',
        logoSrc: '/aiaraldea.png',
        url: 'https://aiaraldea.eus/urduna/1775554001584-ametsik-goienak-betetzeko-grina',
        excerpt: 'Segundo artículo local de seguimiento.'
      },
      {
        title: 'Cobertura de Naiz - Berria',
        date: '06/06/2026',
        source: 'Naiz - Berria',
        logoSrc: '/naiz.png',
        url: 'https://gaur8.naiz.eus/eu/info_gaur8/20260606/ametsgoien-proiektu-solidarioa-babesleku-bat-haurrekin-kale-egoeran-dauden-emakumeentzat',
        excerpt: 'Reportaje reciente en prensa vasca.'
      }
    ]
  },
  eu: {
    title: 'Bloga',
    subtitle: 'Ametsgoieni buruzko prentsako aipamenak eta artikuluak biltzen ditugu.',
    ctaTitle: 'Gurekin harremanetan jarri nahi duzu?',
    ctaSubtitle: 'Komunikabidea bazara edo proiektuari buruzko argitalpen bat partekatu nahi baduzu, idatz iezaguzu kontaktu orritik.',
    ctaButton: 'Joan kontaktura',
    readArticle: 'Artikulua irakurri',
    items: [
      {
        title: 'Ametsgoien: Aitor eta Josuren elkartasun-ametsa Urduñan',
        date: '09/12/2025',
        source: 'Cadena Ser',
        logoSrc: '/cadenaser.png',
        url: 'https://cadenaser.com/euskadi/2025/12/09/ametsgoien-el-sueno-solidario-de-aitor-y-josu-en-orduna-que-abrira-un-hogar-para-mujeres-migradas-con-sus-hijos-en-2026-radio-bilbao/',
        excerpt: 'Proiektuaren jatorriari buruzko erreportajea, 2026an emakume migratuentzat eta haien seme-alabentzat irekiko den etxeari buruzkoa.'
      },
      {
        title: 'Ametsgoien TVEn',
        date: '23/01/2026',
        source: 'TVE',
        logoSrc: '/tve.png',
        url: 'https://www.rtve.es/play/videos/telenorte-pais-vasco/orduna-amets-goien/16907765/',
        excerpt: 'Elkarteari eta Urduñan egiten duen lanari buruzko telebista pieza.'
      },
      {
        title: 'Hau da Ametsgoien',
        date: '26/02/2026',
        source: 'Radio Nervión',
        logoSrc: '/radionervion.png',
        url: 'https://www.radionervion.com/2026/02/26/asi-es-ametsgoien-de-una-iniciativa-familiar-a-un-proyecto-social-y-de-acogida-en-orduna/',
        excerpt: 'Solasaldia eta testuingurua, familia-ekimenetik harrera proiektu sozialera egindako bidea azaltzeko.'
      },
      {
        title: 'Urduñako etxea babesleku bihurtuta',
        date: '27/02/2026',
        source: 'El Correo',
        logoSrc: '/elcorreo.png',
        url: 'https://www.elcorreo.com/bizkaia/nervion/casa-orduna-convertida-refugio-mujeres-hijos-20260227183819-nt.html#goog_rewarded',
        excerpt: 'Emakume eta haurrentzako Urduñan irekitako babeslekuari buruzko prentsa-estaldura.'
      },
      {
        title: 'Ametsgoien: mundu hobea nahi dugu',
        date: '01/03/2026',
        source: 'DEIA',
        logoSrc: '/deia.png',
        url: 'https://www.deia.eus/gente/2026/03/01/ametsgoien-queremos-mundo-mejor-encontramos-10763118.html',
        excerpt: 'Elkartearen misioari eta lehen urratsei buruzko erreportajea.'
      },
      {
        title: 'Onda Vascako estaldura',
        date: '01/03/2026',
        source: 'Onda Vasca',
        logoSrc: '/ondavasca.png',
        url: 'https://www.ondavasca.com/ametsgoien-queremos-dejar-este-mundo-un-poco-mejor-de-como-lo-encontramos/',
        excerpt: 'Proiektuaren komunitate-inpaktuari buruzko emankizuna.'
      },
      {
        title: 'Ametsgoien Urduñan jaio da',
        date: '02/03/2026',
        source: 'Aiaraldea',
        logoSrc: '/aiaraldea.png',
        url: 'https://aiaraldea.eus/urduna/1772486135053-ametsgoien-jaio-da-emakume-migratuentzako-urdunako-aterpea',
        excerpt: 'Elkartearen jaiotzari buruzko albiste lokala.'
      },
      {
        title: 'Ametsgoienek ateak ireki ditu',
        date: '11/03/2026',
        source: 'Radio Llodio',
        logoSrc: '/radionervion.png',
        url: 'https://radiollodio.com/2026/03/11/ametsgoien-abre-sus-puertas-en-orduna/',
        excerpt: 'Proiektuaren irekierari buruzko irrati pieza laburra.'
      },
      {
        title: 'Urduñan etxe bat emakumeentzat eta haurrentzat',
        date: '18/03/2026',
        source: 'El Mundo Empresarial',
        logoSrc: '/elmundoempresarial.png',
        url: 'https://elmundoempresarial.info/2026/03/18/ametsgoien-un-hogar-en-orduna-para-mujeres-con-hijas-e-hijos-en-situacion-de-vulnerabilidad/responsabilidad-social/',
        excerpt: 'Prentsa espezializatuan jasotako estaldura, erantzukizun sozialari eta proiektuari buruzkoa.'
      },
      {
        title: 'Onda Ceroko podcastaren aipamena',
        date: '01/04/2026',
        source: 'Onda Cero',
        logoSrc: '/ondacero.png',
        url: 'https://www.ondacero.es/podcast/emisoras/bilbao/brujula-euskadi/brujula-euskadi-01042026_2026040169cd58f40c3ff85f327286f0.html',
        excerpt: 'Eskualdeko podcast batean egindako aipamena.'
      },
      {
        title: 'Ametsik Goienak betetzeko grina',
        date: '09/04/2026',
        source: 'Aiaraldea',
        logoSrc: '/aiaraldea.png',
        url: 'https://aiaraldea.eus/urduna/1775554001584-ametsik-goienak-betetzeko-grina',
        excerpt: 'Jarraipeneko tokiko bigarren artikulua.'
      },
      {
        title: 'Naiz - Berriaren estaldura',
        date: '06/06/2026',
        source: 'Naiz - Berria',
        logoSrc: '/naiz.png',
        url: 'https://gaur8.naiz.eus/eu/info_gaur8/20260606/ametsgoien-proiektu-solidarioa-babesleku-bat-haurrekin-kale-egoeran-dauden-emakumeentzat',
        excerpt: 'Euskal prentsako azken erreportajea.'
      }
    ]
  },
  en: {
    title: 'Blog',
    subtitle: 'We gather press mentions and articles about Ametsgoien.',
    ctaTitle: 'Would you like to contact us?',
    ctaSubtitle: 'If you are a media outlet or want to share an article about the project, reach out through the contact page.',
    ctaButton: 'Go to contact',
    readArticle: 'Read article',
    items: [
      {
        title: 'Ametsgoien: the solidarity dream of Aitor and Josu in Orduña',
        date: '09/12/2025',
        source: 'Cadena Ser',
        logoSrc: '/cadenaser.png',
        url: 'https://cadenaser.com/euskadi/2025/12/09/ametsgoien-el-sueno-solidario-de-aitor-y-josu-en-orduna-que-abrira-un-hogar-para-mujeres-migradas-con-sus-hijos-en-2026-radio-bilbao/',
        excerpt: 'A feature about the origin of the project and the home that will open for migrant women and their children in 2026.'
      },
      {
        title: 'Ametsgoien on TVE',
        date: '23/01/2026',
        source: 'TVE',
        logoSrc: '/tve.png',
        url: 'https://www.rtve.es/play/videos/telenorte-pais-vasco/orduna-amets-goien/16907765/',
        excerpt: 'A television segment about the association and its work in Orduña.'
      },
      {
        title: 'What Ametsgoien is like',
        date: '26/02/2026',
        source: 'Radio Nervión',
        logoSrc: '/radionervion.png',
        url: 'https://www.radionervion.com/2026/02/26/asi-es-ametsgoien-de-una-iniciativa-familiar-a-un-proyecto-social-y-de-acogida-en-orduna/',
        excerpt: 'Interview and background on the shift from a family initiative to a social reception project.'
      },
      {
        title: 'Orduña house turned into a refuge',
        date: '27/02/2026',
        source: 'El Correo',
        logoSrc: '/elcorreo.png',
        url: 'https://www.elcorreo.com/bizkaia/nervion/casa-orduna-convertida-refugio-mujeres-hijos-20260227183819-nt.html#goog_rewarded',
        excerpt: 'Press coverage of the refuge opened in Orduña for women and children.'
      },
      {
        title: 'Ametsgoien: we want a better world',
        date: '01/03/2026',
        source: 'DEIA',
        logoSrc: '/deia.png',
        url: 'https://www.deia.eus/gente/2026/03/01/ametsgoien-queremos-mundo-mejor-encontramos-10763118.html',
        excerpt: 'A profile piece about the association’s mission and first steps.'
      },
      {
        title: 'Onda Vasca coverage',
        date: '01/03/2026',
        source: 'Onda Vasca',
        logoSrc: '/ondavasca.png',
        url: 'https://www.ondavasca.com/ametsgoien-queremos-dejar-este-mundo-un-poco-mejor-de-como-lo-encontramos/',
        excerpt: 'Broadcast focused on the project’s community impact.'
      },
      {
        title: 'Ametsgoien is born in Orduña',
        date: '02/03/2026',
        source: 'Aiaraldea',
        logoSrc: '/aiaraldea.png',
        url: 'https://aiaraldea.eus/urduna/1772486135053-ametsgoien-jaio-da-emakume-migratuentzako-urdunako-aterpea',
        excerpt: 'Local news about the birth of the association.'
      },
      {
        title: 'Ametsgoien opens its doors',
        date: '11/03/2026',
        source: 'Radio Llodio',
        logoSrc: '/radionervion.png',
        url: 'https://radiollodio.com/2026/03/11/ametsgoien-abre-sus-puertas-en-orduna/',
        excerpt: 'A short radio piece about the opening of the project.'
      },
      {
        title: 'A home in Orduña for women with children',
        date: '18/03/2026',
        source: 'El Mundo Empresarial',
        logoSrc: '/elmundoempresarial.png',
        url: 'https://elmundoempresarial.info/2026/03/18/ametsgoien-un-hogar-en-orduna-para-mujeres-con-hijas-e-hijos-en-situacion-de-vulnerabilidad/responsabilidad-social/',
        excerpt: 'Business press coverage about social responsibility and the project.'
      },
      {
        title: 'Onda Cero podcast mention',
        date: '01/04/2026',
        source: 'Onda Cero',
        logoSrc: '/ondacero.png',
        url: 'https://www.ondacero.es/podcast/emisoras/bilbao/brujula-euskadi/brujula-euskadi-01042026_2026040169cd58f40c3ff85f327286f0.html',
        excerpt: 'A mention on a regional podcast program.'
      },
      {
        title: 'Ametsik Goienak betetzeko grina',
        date: '09/04/2026',
        source: 'Aiaraldea',
        logoSrc: '/aiaraldea.png',
        url: 'https://aiaraldea.eus/urduna/1775554001584-ametsik-goienak-betetzeko-grina',
        excerpt: 'A follow-up local article.'
      },
      {
        title: 'Naiz - Berria coverage',
        date: '06/06/2026',
        source: 'Naiz - Berria',
        logoSrc: '/naiz.png',
        url: 'https://gaur8.naiz.eus/eu/info_gaur8/20260606/ametsgoien-proiektu-solidarioa-babesleku-bat-haurrekin-kale-egoeran-dauden-emakumeentzat',
        excerpt: 'A recent feature in the Basque press.'
      }
    ]
  }
};

export default function NewsPage() {
  const { language } = useLanguage();
  const page = blogContent[language as Language] ?? blogContent.es;

  return (
    <>
      <Navbar />

      <div id="main-content" className="min-h-screen pt-20" style={{ backgroundColor: '#E8D5F2' }} role="main">
        <section className="py-20 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#8A4D76' }}>
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              {page.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {page.subtitle}
            </p>
          </div>
        </section>

        <section className="py-16 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.items.map((n) => (
                <NewsCard
                  key={`${n.source}-${n.date}-${n.title}`}
                  title={n.title}
                  date={n.date}
                  source={n.source}
                  url={n.url}
                  excerpt={n.excerpt}
                  logoSrc={n.logoSrc}
                  buttonLabel={page.readArticle}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#8A4D76] mb-4">
              {page.ctaTitle}
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              {page.ctaSubtitle}
            </p>
            <a href="/contacto">
              <button className="px-8 py-4 bg-[#8A4D76] text-white rounded-full font-semibold text-lg hover:bg-[#6B3A5E] transition-all duration-300 shadow-lg hover:shadow-xl">
                {page.ctaButton}
              </button>
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
