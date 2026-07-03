import "./termosUso.css";

export default function TermosUso() {

  return (
    <main className="termos-page">
      <div className="termos-card">

        <header className="termos-header">
          <h1>Termos de Uso e Política de Privacidade</h1>

          <p>
            Última atualização: <strong>Junho de 2026</strong>
          </p>
        </header>

        <div className="termos-alert">
          Ao criar uma conta no <strong>Recicla que Pontua</strong>, você
          declara que leu, compreendeu e concorda com os termos e políticas
          descritos nesta página.
        </div>

        <section>
          <h2>1. Identificação e veracidade dos dados</h2>

          <p>
            O usuário declara que todas as informações fornecidas durante o
            cadastro são verdadeiras, completas e atualizadas.
          </p>

          <p>São coletados dados como:</p>

          <ul>
            <li>Nome completo;</li>
            <li>CPF ou CNPJ (quando aplicável);</li>
            <li>Data de nascimento;</li>
            <li>E-mail;</li>
            <li>Telefone;</li>
            <li>
              Cidade, estado e demais informações necessárias ao funcionamento
              da plataforma.
            </li>
          </ul>

          <p>
            O fornecimento de informações falsas poderá resultar na suspensão ou
            exclusão da conta.
          </p>
        </section>

        <section>
          <h2>2. Confirmação de maioridade</h2>

          <p>
            Ao realizar o cadastro, o usuário declara possuir
            <strong> 18 anos ou mais</strong>.
          </p>

          <p>
            Caso seja identificado cadastro realizado por menor de idade, a
            plataforma poderá cancelar a conta.
          </p>
        </section>

        <section>
          <h2>3. Política de Privacidade</h2>

          <p>
            O Recicla que Pontua coleta apenas os dados necessários para o
            funcionamento da plataforma.
          </p>

          <p>Os dados são utilizados para:</p>

          <ul>
            <li>Identificação dos usuários;</li>
            <li>Autenticação e recuperação de acesso;</li>
            <li>Localização de parceiros próximos;</li>
            <li>Comunicação entre usuários;</li>
            <li>Controle de pontuação e recompensas;</li>
            <li>Garantia da segurança da plataforma.</li>
          </ul>
        </section>

        <section>
          <h2>4. Compartilhamento de informações</h2>

          <p>
            A plataforma <strong>não comercializa</strong> nem compartilha dados
            pessoais sensíveis com terceiros.
          </p>

          <p>As seguintes informações permanecem privadas:</p>

          <ul>
            <li>CPF;</li>
            <li>CNPJ;</li>
            <li>Senha;</li>
            <li>Endereço completo;</li>
          </ul>

          <p>
            Outros usuários visualizarão apenas as informações necessárias para
            utilização da plataforma, como nome, cidade e tipo de perfil.
          </p>
        </section>

        <section>
          <h2>5. Armazenamento e proteção dos dados</h2>

          <p>
            Os dados são armazenados de forma segura utilizando serviços do
            <strong> Firebase (Google)</strong>.
          </p>

          <p>
            Embora sejam adotadas medidas para proteger as informações, nenhum
            sistema é totalmente imune a falhas de segurança.
          </p>
        </section>

        <section>
          <h2>6. Direitos do usuário (LGPD)</h2>

          <p>
            Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), o
            usuário poderá solicitar:
          </p>

          <ul>
            <li>Acesso aos seus dados;</li>
            <li>Correção de informações;</li>
            <li>Atualização cadastral;</li>
            <li>Exclusão da conta e dos dados pessoais, quando permitido por lei.</li>
          </ul>
        </section>

        <section>
          <h2>7. Responsabilidade pelos encontros presenciais</h2>

          <p>
            O Recicla que Pontua atua apenas como intermediador entre usuários.
          </p>

          <p>
            A plataforma não se responsabiliza por negociações, trocas, doações
            ou encontros realizados fora do ambiente digital.
          </p>
        </section>

        <section>
          <h2>8. Conduta do usuário</h2>

          <p>Ao utilizar a plataforma, o usuário compromete-se a:</p>

          <ul>
            <li>Utilizar o sistema apenas para fins lícitos;</li>
            <li>Fornecer informações verdadeiras;</li>
            <li>Respeitar outros usuários;</li>
            <li>Não praticar assédio, ameaças ou discriminação;</li>
            <li>Não utilizar a plataforma para golpes ou fraudes.</li>
          </ul>

          <p>
            Violações poderão resultar em advertência, suspensão ou exclusão da
            conta.
          </p>
        </section>

        <section>
          <h2>9. Sistema de avaliações e denúncias</h2>

          <p>
            Após uma interação, usuários poderão realizar avaliações e denúncias
            sobre comportamentos inadequados.
          </p>

          <p>
            As denúncias serão analisadas e poderão resultar em suspensão ou
            exclusão da conta.
          </p>
        </section>

        <section>
          <h2>10. Comunicação entre usuários</h2>

          <p>
            A troca de mensagens somente poderá ocorrer após a aceitação mútua
            da solicitação de contato.
          </p>
        </section>

        <section>
          <h2>11. Segurança da conta</h2>

          <p>
            O usuário é responsável por manter sua senha em sigilo e comunicar
            imediatamente qualquer uso não autorizado da conta.
          </p>
        </section>

        <section>
          <h2>12. Alterações destes termos</h2>

          <p>
            Estes Termos de Uso e Política de Privacidade poderão ser alterados
            sempre que necessário. A versão mais recente permanecerá disponível
            nesta página.
          </p>
        </section>

        <div className="termos-footer">
          <strong>
            Ao marcar a opção de aceite durante o cadastro, você declara que
            leu e concorda com todas as condições acima.
          </strong>
        </div>
      </div>
    </main>
  );
}