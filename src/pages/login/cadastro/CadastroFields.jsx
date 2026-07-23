import { useEffect, useState } from 'react';
import  { maskCPF, maskCNPJ, maskTelefone } from '../../../utils/Formatters';

const mascaras = {
  cpf: maskCPF,
  cnpj: maskCNPJ,
  telefone: maskTelefone,
};

export default function CadastroFields({
  secoes,
  formData,
  errors,
  setFormData,
  setErrors,
}) {
  // Cache das cidades já buscadas, por sigla de estado (evita rebuscar
  // toda vez que o usuário troca de estado e volta pro mesmo depois).
  const [cidadesPorEstado, setCidadesPorEstado] = useState({});
  const [estadoCarregando, setEstadoCarregando] = useState(null);

  const estadoSelecionado = formData.estado;

  useEffect(() => {
    if (!estadoSelecionado || cidadesPorEstado[estadoSelecionado]) return;

    let cancelado = false;

    async function buscarCidades() {
      setEstadoCarregando(estadoSelecionado);
      try {
        const resposta = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`
        );
        const dados = await resposta.json();

        if (cancelado) return;

        const nomes = dados
          .map((cidade) => cidade.nome)
          .sort((a, b) => a.localeCompare(b, 'pt-BR'));

        setCidadesPorEstado((prev) => ({
          ...prev,
          [estadoSelecionado]: nomes,
        }));
      } catch (erro) {
        console.error('Não foi possível carregar as cidades:', erro);
      } finally {
        if (!cancelado) setEstadoCarregando(null);
      }
    }

    buscarCidades();

    return () => {
      cancelado = true;
    };
  }, [estadoSelecionado, cidadesPorEstado]);

  function handleChange(campo, rawValue) {
    const aplicarMascara = mascaras[campo.name];
    const valor = aplicarMascara ? aplicarMascara(rawValue) : rawValue;

    setFormData((prev) => {
      const atualizado = { ...prev, [campo.name]: valor };

      // Trocou de estado? limpa a cidade escolhida antes, já que a lista
      // de opções muda.
      if (campo.name === 'estado' && prev.estado !== valor) {
        atualizado.cidade = '';
      }

      return atualizado;
    });

    setErrors((prev) => ({
      ...prev,
      [campo.name]: undefined,
    }));
  }

  function renderSelect(campo) {
    const carregando = campo.dependsOn && estadoCarregando === formData[campo.dependsOn];
    const bloqueado = campo.dependsOn && !formData[campo.dependsOn];

    const opcoes = campo.dependsOn
      ? (cidadesPorEstado[formData[campo.dependsOn]] || []).map((nome) => ({
          value: nome,
          label: nome,
        }))
      : campo.options || [];

    let textoPlaceholder = campo.placeholder;
    if (bloqueado) textoPlaceholder = 'Selecione o estado primeiro';
    else if (carregando) textoPlaceholder = 'Carregando cidades...';

    return (
      <select
        value={formData[campo.name] || ''}
        className={errors[campo.name] ? 'error' : ''}
        disabled={bloqueado || carregando}
        onChange={(e) => handleChange(campo, e.target.value)}
      >
        <option value="" disabled>
          {textoPlaceholder}
        </option>
        {opcoes.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </select>
    );
  }

  function renderCampo(campo) {
    if (campo.type === 'select') {
      return renderSelect(campo);
    }

    return (
      <input
        type={campo.type}
        placeholder={campo.placeholder}
        value={formData[campo.name] || ''}
        className={errors[campo.name] ? 'error' : ''}
        inputMode={
          ['cpf', 'cnpj', 'telefone', 'cep'].includes(campo.name)
            ? 'numeric'
            : undefined
        }
        onChange={(e) => handleChange(campo, e.target.value)}
      />
    );
  }

  return (
    <div className="cadastro-fields">
      {secoes.map((secao) => (
        <div key={secao.titulo} className="cadastro-secao">
          <h3 className="secao-titulo">{secao.titulo}</h3>

          <div className="secao-grid">
            {secao.campos.map((campo) => (
              <div
                key={campo.name}
                className={`input-group ${campo.size === "small" ? "small" : "full"}`}
              >
                {renderCampo(campo)}

                {errors[campo.name] && (
                  <span className="form-error">
                    {errors[campo.name]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
