import Navbar from "../navbar/Navbar";
import Rodape from "../rodape/Rodape";

/**
 * Estrutura comum das páginas do site.
 *
 * Não cria um contêiner visual próprio: apenas mantém navbar, conteúdo e
 * rodapé na mesma ordem. Assim, cada página continua controlando sua largura,
 * fundo e espaçamentos sem duplicar a estrutura externa.
 */
export default function PageLayout({
  children,
  showNavbar = true,
  showFooter = true,
}) {
  return (
    <>
      {showNavbar && <Navbar />}
      {children}
      {showFooter && <Rodape />}
    </>
  );
}
