import * as avaliacaoResultadosHelperAPI from '@/helpers/api/AvaliacaoResultados';
import * as types from './types';

export const dadosMenu = ({ commit }) => {
    avaliacaoResultadosHelperAPI.dadosMenu()
        .then((response) => {
            const data = response.data;
            const dadosTabela = data.data;
            commit(types.SET_REGISTROS_TABELA, dadosTabela);
        });
};

export const setRegistroAtivo = ({ commit }, registro) => {
    commit(types.SET_REGISTRO_ATIVO, registro);
};

export const removerRegistro = ({ commit }, registro) => {
    avaliacaoResultadosHelperAPI.removerRegistro(registro)
        .then(() => {
            commit(types.REMOVER_REGISTRO, registro);
        });
};

export const getDadosEmissaoParecer = ({ commit }, param) => {
    const p = new Promise((resolve) => {
        avaliacaoResultadosHelperAPI.parecerConsolidacao(param)
            .then((response) => {
                const data = response.data.data.items;

                commit(types.GET_PROPONENTE, data.proponente);
                commit(types.GET_PROJETO, data.projeto);
                commit(types.GET_PARECER, data.parecer);
                commit(types.GET_CONSOLIDACAO_PARECER, data.consolidacaoComprovantes);
                commit(types.GET_OBJETO_PARECER, data.objetoParecer);
                resolve();
            }).catch(() => { });
    });
    return p;
};

export const salvarParecer = (_, params) => {
    const p = new Promise((resolve) => {
        avaliacaoResultadosHelperAPI.criarParecer(params)
            .then(() => {
                resolve();
            });
    });

    return p;
};

export const mockAvaliacaDesempenho = ({ commit }) => {
    commit(types.MOCK_AVALIACAO_RESULTADOS);
};

export const obterDestinatarios = ({ commit }) => {
    avaliacaoResultadosHelperAPI.obterDestinatarios()
        .then((response) => {
            const data = response.data;
            const destinatariosEncaminhamento = data.data;
            commit(types.DESTINATARIOS_ENCAMINHAMENTO, destinatariosEncaminhamento.items);
        });
};

export const obterDadosTabelaTecnico = ({ commit }, params) => {
    commit(types.PROJETOS_AVALIACAO_TECNICA, {});
    avaliacaoResultadosHelperAPI.obterDadosTabelaTecnico(params)
        .then((response) => {
            const data = response.data.data;
            data.items.forEach((a, index) => {
                avaliacaoResultadosHelperAPI.listarDiligencias(a.idPronac).then(
                    (response) => {
                        const obj = response.data.data;
                        data.items[index].diligencias = obj.items;
                    },
                );
            });
            commit(types.PROJETOS_AVALIACAO_TECNICA, data);
        }).catch(() => console.log('error'));
};

export const obetDadosDiligencias = ({ commit }, params) => {
    avaliacaoResultadosHelperAPI.listarDiligencias(params).then(
        (response) => {
            const obj = response.data.data;
            commit(types.HISTORICO_DILIGENCIAS, obj);
        },
    );
};

export const projetosFinalizados = ({ commit }, params) => {
    avaliacaoResultadosHelperAPI.obterDadosTabelaTecnico(params)
        .then((response) => {
            const data = response.data;
            const dadosTabela = data.data;
            commit(types.SET_DADOS_PROJETOS_FINALIZADOS, dadosTabela);
        }).catch(() => console.log('error'));
};

export const obterHistoricoEncaminhamento = ({ commit }, params) => {
    avaliacaoResultadosHelperAPI.obterHistoricoEncaminhamento(params)
        .then((response) => {
            const dadosEncaminhamento = response.data.data;
            commit(types.HISTORICO_ENCAMINHAMENTO, dadosEncaminhamento.items);
        }).catch(() => console.log('error'));
};

export const getTipoAvaliacao = ({ commit }, params) => {
    const p = new Promise((resolve) => {
        avaliacaoResultadosHelperAPI.getTipoAvaliacao(params)
            .then((response) => {
                const data = response.data.data.items;

                commit(types.GET_TIPO_AVALIACAO, data);
                resolve();
            }).catch(() => { });
    });
    return p;
};

// deprecated
export const planilha = ({ commit }, params) => {
    avaliacaoResultadosHelperAPI.planilha(params)
        .then((response) => {
            const planilha = response.data;
            commit(types.GET_PLANILHA, planilha);
        }).catch((error) => {
            const data = error.response;
            commit(types.GET_PLANILHA, { error: data.data.data.erro });
        });
};

export const syncPlanilhaAction = ({ commit }, params) => {
    commit(types.GET_PLANILHA, {});
    avaliacaoResultadosHelperAPI.planilha(params)
        .then((response) => {
            const planilha = response.data;
            commit(types.GET_PLANILHA, planilha);
        }).catch((error) => {
            const data = error.response;
            commit(types.GET_PLANILHA, { error: data.data.data.erro });
        });
};
// deprecated use syncProjetoAction
export const projetoAnalise = ({ commit }, params) => {
    avaliacaoResultadosHelperAPI.projetoAnalise(params)
        .then((response) => {
            const projetoAnalise = response.data;
            commit(types.GET_PROJETO_ANALISE, projetoAnalise);
        }).catch(() => console.log('error'));
};

export const syncProjetoAction = ({ commit }, params) => {
    commit(types.GET_PROJETO_ANALISE, {});
    avaliacaoResultadosHelperAPI.projetoAnalise(params)
        .then((response) => {
            const projetoAnalise = response.data;
            commit(types.GET_PROJETO_ANALISE, projetoAnalise);
        }).catch(() => console.log('error'));
};

export const consolidacaoAnalise = ({ commit }, params) => {
    avaliacaoResultadosHelperAPI.consolidacaoAnalise(params)
        .then((response) => {
            const consolidacaoAnalise = response.data;
            commit(types.GET_CONSOLIDACAO_ANALISE, consolidacaoAnalise);
        }).catch(() => console.log('error'));
};

export const finalizarParecer = (_, params) => {
    avaliacaoResultadosHelperAPI.alterarEstado(params)
        .then(() => {
        });
};

export const encaminharParaTecnico = ({ commit, dispatch }, params) => {
    commit(types.SET_DADOS_PROJETOS_PARA_DISTRIBUIR, {});
    commit(types.PROJETOS_AVALIACAO_TECNICA, {});
    avaliacaoResultadosHelperAPI
        .alterarEstado(params)
        .then(() => {
            dispatch('projetosParaDistribuir');
            dispatch('obterDadosTabelaTecnico', { estadoid: 5 });
        }).catch(() => console.log('error'))
    ;
};

export const alterarParecer = ({ commit }, param) => {
    commit(types.SET_PARECER, param);
};

export const obterDadosItemComprovacao = ({ commit }, params) => avaliacaoResultadosHelperAPI
    .obterDadosItemComprovacao(params)
    .then((response) => {
        const itemComprovacao = response.data.data;
        commit(types.GET_DADOS_ITEM_COMPROVACAO, itemComprovacao.items);
    }).catch(() => console.log('error'));

export const getLaudoFinal = ({ commit }, params) => {
    avaliacaoResultadosHelperAPI.obterLaudoFinal(params)
        .then((response) => {
            const dados = response.data.data;
            commit(types.GET_PARECER_LAUDO_FINAL, dados);
        }).catch(() => console.log('error'));
};

export const salvarLaudoFinal = ({ commit }, data) => {
    avaliacaoResultadosHelperAPI.criarParecerLaudoFinal(data)
        .then(() => {
            commit('noticias/SET_DADOS', { ativo: true, color: 'success', text: 'Salvo com sucesso!' }, { root: true });
        });
};

export const finalizarLaudoFinal = ({ commit }, data) => {
    avaliacaoResultadosHelperAPI.alterarEstado(data)
        .then(() => {
            commit('noticias/SET_DADOS', { ativo: true, color: 'success', text: 'Finalizado com sucesso!' }, { root: true });
        }).catch(() => console.log('error'));
};

export const enviarDiligencia = (_, data) => {
    avaliacaoResultadosHelperAPI.criarDiligencia(data)
        .then(() => {
        });
};

export const projetosParaDistribuir = ({ commit }) => {
    avaliacaoResultadosHelperAPI.obterProjetosParaDistribuir()
        .then((response) => {
            const data = response.data;
            commit(types.SET_DADOS_PROJETOS_PARA_DISTRIBUIR, data);
        }).catch(() => console.log('error'));
};

export const projetosAssinatura = ({ commit }, params) => {
    let type = '';
    switch (params.estado) {
    case 'em_assinatura':
        type = types.SET_DADOS_PROJETOS_EM_ASSINATURA;
        break;
    case 'historico':
        type = types.SET_DADOS_PROJETOS_HISTORICO;
        break;
    case 'assinar':
    default:
        type = types.SET_DADOS_PROJETOS_ASSINAR;
    }

    avaliacaoResultadosHelperAPI.obterProjetosAssinatura(params)
        .then((response) => {
            const data = response.data;
            const dadosTabela = data.data;
            commit(type, dadosTabela);
        }).catch(() => console.log('error'));
};

export const obterProjetosLaudoFinal = ({ commit }, param) => {
    avaliacaoResultadosHelperAPI.obterProjetosLaudoFinal(param)
        .then((response) => {
            const data = response.data;
            const dadosTabela = data.data;
            commit(types.SET_DADOS_PROJETOS_LAUDO_FINAL, dadosTabela);
        }).catch(() => console.log('error'));
};

export const obterProjetosLaudoAssinar = ({ commit }, param) => {
    avaliacaoResultadosHelperAPI.obterProjetosLaudoFinal(param)
        .then((response) => {
            const dadosTabela = response.data.data;
            commit(types.SET_DADOS_PROJETOS_LAUDO_ASSINAR, dadosTabela);
        }).catch(() => console.log('error'));
};

export const obterProjetosLaudoEmAssinatura = ({ commit }, param) => {
    avaliacaoResultadosHelperAPI.obterProjetosLaudoFinal(param)
        .then((response) => {
            const dadosTabela = response.data.data;
            commit(types.SET_DADOS_PROJETOS_LAUDO_EM_ASSINATURA, dadosTabela);
        }).catch(() => console.log('error'));
};

export const obterProjetosLaudoFinalizados = ({ commit }, param) => {
    avaliacaoResultadosHelperAPI.obterProjetosLaudoFinal(param)
        .then((response) => {
            const dadosTabela = response.data.data;
            commit(types.SET_DADOS_PROJETOS_LAUDO_FINALIZADOS, dadosTabela);
        }).catch(() => console.log('error'));
};

export const projetosRevisao = ({ commit }, params) => {
    avaliacaoResultadosHelperAPI.projetosRevisao(params)
        .then((response) => {
            const projetosRevisao = response.data.data;
            commit(types.SYNC_PROJETOS_REVISAO, projetosRevisao);
        }).catch(() => console.log('error'));
};

export const buscarComprovantes = ({ commit }, params) => {
    avaliacaoResultadosHelperAPI.buscarComprovantes(params)
        .then((response) => {
            const data = response.data;
            const itens = data.data;
            commit(types.SET_COMPROVANTES, itens);
        }).catch(() => console.log('error'));
};

export const devolverProjeto = ({ commit, dispatch }, params) => {
    commit(types.SET_DADOS_PROJETOS_FINALIZADOS, {});
    commit(types.SYNC_PROJETOS_ASSINAR_COORDENADOR, {});
    commit(types.PROJETOS_AVALIACAO_TECNICA, {});

    let projetosTecnico = {};
    let projetosFinalizados = {};

    if (
        parseInt(params.usuario.grupo_ativo, 10) === 125
        || parseInt(params.usuario.grupo_ativo, 10) === 126
    ) {
        projetosTecnico = {
            estadoid: 5,
        };

        projetosFinalizados = {
            estadoid: 6,
        };
    } else {
        projetosTecnico = {
            estadoid: 5,
            idAgente: params.usuario.usu_codigo,
        };

        projetosFinalizados = {
            estadoid: 6,
            idAgente: params.usuario.usu_codigo,
        };
    }

    avaliacaoResultadosHelperAPI.alterarEstado(params)
        .then((response) => {
            const devolverProjeto = response.data;
            commit(types.SET_DEVOLVER_PROJETO, devolverProjeto);

            dispatch('projetosFinalizados', projetosFinalizados);
            dispatch('projetosAssinarCoordenador', { estadoid: 9 });
            dispatch('obterDadosTabelaTecnico', projetosTecnico);
        }).catch(() => console.log('error'));
};

export const projetosAssinarCoordenador = ({ commit }) => {
    avaliacaoResultadosHelperAPI.projetosPorEstado({ estadoid: 9 })
        .then((response) => {
            const dados = response.data;
            commit(types.SYNC_PROJETOS_ASSINAR_COORDENADOR, dados.data);
        }).catch(() => console.log('error'));
};

export const projetosAssinarCoordenadorGeral = ({ commit }) => {
    avaliacaoResultadosHelperAPI.projetosPorEstado({ estadoid: 15 })
        .then((response) => {
            const dados = response.data;
            commit(types.SYNC_PROJETOS_ASSINAR_COORDENADOR_GERAL, dados.data);
        }).catch(() => console.log('error'));
};

export const salvarAvaliacaoComprovante = (_, params) =>
    avaliacaoResultadosHelperAPI.salvarAvaliacaoComprovante(params);

export const alterarAvaliacaoComprovante = ({ commit }, params) =>
    commit(types.ALTERAR_DADOS_ITEM_COMPROVACAO, params);

export const alterarPlanilha = ({ commit }, params) =>
    commit(types.ALTERAR_PLANILHA, params);
