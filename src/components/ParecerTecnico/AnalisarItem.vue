<template>
    <v-layout row justify-center>
        <v-dialog
            v-model="dialog"
            scrollable
            fullscreen
            transition="dialog-bottom-transition"
            hide-overlay
        >
            <v-snackbar
                v-model="snackbarAlerta"
            >
                {{ snackbarTexto }}
                <v-btn
                    color="pink"
                    flat
                    @click="snackbarAlerta = false"
                >
                    Fechar
                </v-btn>
            </v-snackbar>

            <v-btn
                slot="activator"
                color="red"
                dark
                small
                title="Comprovar Item"
            >
                <v-icon>gavel</v-icon>
            </v-btn>
            <v-card>
                <v-toolbar dark color="green darken-3">
                    <v-btn icon dark @click.native="fecharModal">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Avaliar itens</v-toolbar-title>
                </v-toolbar>

                <v-card-text v-if="dadosItemComprovacao.comprovantes && !comprovantesIsLoading">
                    <v-subheader >Dados da Comprovação</v-subheader>
                    <v-data-table
                        class="elevation-2"
                        hide-headers
                        :items="[]"
                        hide-actions
                    >
                        <template slot="no-data">
                            <tr>
                                <th colspan="6">Comprova&ccedil;&atilde;o de Pagamento do Item</th>
                            </tr>
                            <tr>
                                <td left><b>Produto:</b></td>
                                <td>{{dadosItemComprovacao.dadosItem.Produto}}</td>
                                <td left><b>Etapa:</b></td>
                                <td>{{dadosItemComprovacao.dadosItem.Etapa}}</td>
                                <td left><b>Item de Custo:</b></td>
                                <td>{{dadosItemComprovacao.dadosItem.Item}}</td>
                            </tr>
                            <tr>
                                <td left><b>Valor Aprovado:</b></td>
                                <td>{{moeda(dadosItemComprovacao.dadosItem.vlAprovado)}}</td>
                                <td left><b>Valor Comprovado:</b></td>
                                <td>{{moeda(dadosItemComprovacao.dadosItem.vlComprovado)}}</td>
                                <td left><b>Comprovação Validada:</b></td>
                                <td>{{moeda(dadosItemComprovacao.dadosItem.ComprovacaoValidada)}}</td>
                            </tr>
                        </template>
                    </v-data-table>

                    <v-subheader >Itens</v-subheader>

                    <v-expansion-panel
                        v-model="painelComprovantes"
                        v-if="dadosItemComprovacao.comprovantes"
                        expand
                    >
                        <v-expansion-panel-content
                            v-for="(comprovante, i) in dadosItemComprovacao.comprovantes"
                            :key="comprovante.idComprovantePagamento"
                            @input="carregarDadosComprovante($event, i)"
                        >
                            <v-layout slot="header" class="blue--text">
                                <v-icon class="mr-3 blue--text" >local_shipping</v-icon>
                                Fornecedor: {{comprovante.fornecedor.nome}} - R$ {{moeda(comprovante.vlComprovacao)}}
                                <v-spacer></v-spacer>
                                <v-chip v-if="comprovante.stItemAvaliado == 1" small color="green" text-color="white">
                                    <v-avatar>
                                        <v-icon>thumb_up</v-icon>
                                    </v-avatar>
                                    Aprovado
                                </v-chip>
                                <v-chip v-if="comprovante.stItemAvaliado == 3" small color="red" text-color="white">
                                    <v-avatar>
                                        <v-icon>thumb_down</v-icon>
                                    </v-avatar>
                                    Reprovado
                                </v-chip>
                                <v-chip v-if="comprovante.stItemAvaliado == 4" small color="grey" text-color="white">
                                    <v-avatar>
                                        <v-icon>thumbs_up_down</v-icon>
                                    </v-avatar>
                                    Não avaliado
                                </v-chip>
                            </v-layout>

                            <v-card
                                color="green lighten-4"
                                flat
                                tile
                            >
                                <v-flex >

                                    <v-toolbar dense>
                                        <v-toolbar-title>Avaliar Comprovante - {{comprovante.arquivo.nome}}</v-toolbar-title>

                                        <v-btn
                                            icon
                                            :href="'/upload/abrir/id/'+ comprovante.arquivo.id"
                                        >
                                            <v-icon>get_app</v-icon>
                                        </v-btn>
                                    </v-toolbar>

                                    <v-card-text>
                                        <v-card>
                                            <v-card-text class="elevation-2">
                                                <v-form
                                                    v-if="renderDadosComprovante[i]"
                                                    v-model="form[comprovante.idComprovantePagamento]"
                                                    ref="form"
                                                >
                                                    <v-data-table
                                                        class="elevation-2"
                                                        hide-headers
                                                        :items="[]"
                                                        hide-actions
                                                    >
                                                        <template slot="no-data">
                                                            <tr>
                                                                <td left><b>Fornecedor:</b></td>
                                                                <td>{{comprovante.fornecedor.nome}}</td>
                                                                <td left><b>CNPJ/CPF:</b></td>
                                                                <td colspan="5">{{comprovante.CNPJCPF}}</td>
                                                            </tr>
                                                            <tr>
                                                                <td left><b>Comprovante:</b></td>
                                                                <td >{{comprovante.tpDocumento}}</td>
                                                                <td left><b>Número:</b></td>
                                                                <td>{{comprovante.numero}}</td>
                                                                <td left><b>S&eacute;rie:</b></td>
                                                                <td colspan="3">{{comprovante.serie}}</td>
                                                            </tr>
                                                            <tr>
                                                                <td left><b>Dt. Emiss&atilde;o do comprovante de despesa:</b></td>
                                                                <td>{{comprovante.dataEmissao | formatarData}}</td>
                                                                <td left><b>Forma de Pagamento:</b></td>
                                                                <td>{{comprovante.tpFormaDePagamento}}</td>
                                                                <td left><b>Data do Pagamento:</b></td>
                                                                <td>{{comprovante.dtPagamento | formatarData}}</td>
                                                                <td left style="width: 155px;"><b>N&ordm; Documento Pagamento:</b></td>
                                                                <td>{{comprovante.numeroDocumento}}</td>
                                                            </tr>
                                                            <tr>
                                                                <td left><b>Valor:</b></td>
                                                                <td>{{moeda(comprovante.valor)}}</td>
                                                                <td left><b>Justificativa do Proponente:</b></td>
                                                                <td colspan="5">{{comprovante.justificativa}}</td>
                                                            </tr>
                                                            <tr>
                                                                <td left><b>Avaliação:</b></td>
                                                                <td colspan="7">
                                                                    <v-radio-group
                                                                        v-model="stItemAvaliadoModel[comprovante.idComprovantePagamento]"
                                                                        :rules="[rules.required]"
                                                                        row
                                                                    >
                                                                        <v-radio label="Aprovado" value="1" name="stItemAvaliadoModel" color="green"></v-radio>
                                                                        <v-radio label="Reprovado" value="3" name="stItemAvaliadoModel" color="red"></v-radio>
                                                                    </v-radio-group>
                                                                </td>
                                                            </tr>
                                                        </template>
                                                    </v-data-table>

                                                    <v-textarea
                                                        solo
                                                        no-resize
                                                        label="Parecer da avaliação"
                                                        height="180px"
                                                        v-model="dsJustificativa[comprovante.idComprovantePagamento]"
                                                        autofocus
                                                        @input="justificativaInput(comprovante.idComprovantePagamento, $event)"
                                                    ></v-textarea>
                                                    <template
                                                        v-if="(stItemAvaliadoModel[comprovante.idComprovantePagamento] === '3'
                                                            && dsJustificativa[comprovante.idComprovantePagamento] == '')">
                                                        <p color="red--text">Por favor preencher o campo acima!</p>
                                                    </template>
                                                    <div>
                                                        <v-btn
                                                            color="primary"
                                                            flat
                                                            :disabled="!form[comprovante.idComprovantePagamento] && !loading"
                                                            :loading="loading"
                                                            @click="salvarAvaliacao({
                                                                index: i,
                                                                idComprovantePagamento: comprovante.idComprovantePagamento,
                                                                stItemAvaliado: stItemAvaliadoModel[comprovante.idComprovantePagamento] || '',
                                                                dsJustificativa: dsJustificativa[comprovante.idComprovantePagamento] || '',
                                                            }); loader = 'loading'"
                                                        >
                                                            Salvar
                                                        </v-btn>
                                                    </div>
                                                </v-form>
                                            </v-card-text>
                                        </v-card>
                                    </v-card-text>
                                </v-flex>
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-card-text>
                <v-card-text v-else>
                    <v-container fill-height>
                        <v-layout row wrap align-center>
                            <v-flex class="text-xs-center">
                                <v-progress-circular
                                    :size="70"
                                    :width="7"
                                    color="green"
                                    indeterminate
                                ></v-progress-circular>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import moment from 'moment';
    import { mapActions, mapGetters } from 'vuex';

    export default {
        name: 'AnalisarItem',
        props: [
            'idPronac',
            'uf',
            'produto',
            'idmunicipio',
            'idPlanilhaItem',
            'etapa',
            'stItemAvaliado',
            'cdProduto',
            'cdUf',
        ],
        filters: {
            formatarData(date) {
                if (date.length === 0) {
                    return '---';
                }
                return moment(date).format('DD/MM/YYYY');
            },
        },
        watch: {
            dialog(val) {
                if (val) this.atualizarComprovantes(true);
            },
            stItemAvaliadoModel: {
                handler(novoValor) {
                    this.stItemAvaliadoModel = novoValor;
                },
                deep: true,
            },
            dadosItemComprovacao() {
                this.dadosItemComprovacaoCopia = this.dadosItemComprovacao;
                this.dadosItemComprovacaoCopia.comprovantes.forEach((comp) => {
                    this.stItemAvaliadoModel[comp.idComprovantePagamento] = comp.stItemAvaliado;
                    this.dsJustificativa[comp.idComprovantePagamento] = comp.dsOcorrenciaDoTecnico;
                });
            },
        },
        data() {
            return {
                renderDadosComprovante: [],
                comprovantesIsLoading: null,
                painelComprovantes: [],
                dadosItemComprovacaoCopia: this.dadosItemComprovacao,
                loader: null,
                loading: false,
                form: {},
                snackbarAlerta: false,
                snackbarTexto: '',
                dsJustificativa: {},
                stItemAvaliadoModel: {},
                rules: {
                    required: v => !!v || 'É necessário preencher este campo',
                },
                projetoHeaders: [
                    {
                        text: 'PRONAC',
                        align: 'center',
                        sortable: false,
                        value: 'pronac',
                    },
                    {
                        text: 'Nome do Projeto',
                        align: 'center',
                        sortable: false,
                        value: 'nomeProjeto',
                    },
                ],
                comprovacaoHeaders: [
                    {
                        text: 'Produto',
                        align: 'center',
                        sortable: false,
                    },
                    {
                        text: 'Etapa',
                        align: 'center',
                        sortable: false,
                    },
                    {
                        text: 'Item de Custo',
                        align: 'center',
                        sortable: false,
                    },
                ],
                produtoHeaders: [
                    {
                        text: 'Valor Aprovado',
                        align: 'center',
                        sortable: false,
                    },
                    {
                        text: 'Valor Comprovado',
                        align: 'center',
                        sortable: false,
                    },
                    {
                        text: 'Comprovação Validada',
                        align: 'center',
                        sortable: false,
                    },
                ],
                itemHeaders: [
                    {
                        text: 'Comprovante',
                        align: 'center',
                        sortable: false,
                    },
                    {
                        text: 'Dt. Emissão do comprovante',
                        align: 'center',
                        sortable: false,
                    },
                    {
                        text: 'c',
                        align: 'center',
                        sortable: false,
                    },
                ],
                dialog: false,
            };
        },
        methods: {
            ...mapActions({
                alterarAvaliacaoComprovante: 'avaliacaoResultados/alterarAvaliacaoComprovante',
                alterarPlanilha: 'avaliacaoResultados/alterarPlanilha',
                salvarAvaliacaoComprovante: 'avaliacaoResultados/salvarAvaliacaoComprovante',
                obterDadosItemComprovacao: 'avaliacaoResultados/obterDadosItemComprovacao',
            }),
            getUrlParamsToJson() {
                let urlParams = this.$route.params[0];
                urlParams = urlParams.split('/');

                const dados = {};

                urlParams.forEach((valor, index) => {
                    if ((index % 2) !== 0) {
                        dados[urlParams[index - 1]] = valor;
                    }
                });
                return dados;
            },
            getUrlParams() {
                return this.$route.params[0];
            },
            moeda: (moedaString) => {
                const moeda = Number(moedaString);
                return moeda.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
            },
            salvarAvaliacao(params) {
                if (
                    this.stItemAvaliadoModel[params.idComprovantePagamento] === '3'
                    && this.dsJustificativa[params.idComprovantePagamento] === ''
                ) {
                    return false;
                }

                if (
                    params.stItemAvaliado.length > 0
                    /* && params.dsJustificativa.length > 0 */
                ) {
                    this.loading = true;
                    this.salvarAvaliacaoComprovante({
                        index: params.index,
                        idPronac: this.idPronac,
                        dsJustificativa: params.dsJustificativa,
                        stItemAvaliado: params.stItemAvaliado,
                        idComprovantePagamento: params.idComprovantePagamento,
                    }).then(() => {
                        this.snackbarTexto = 'Salvo com sucesso!';
                        this.snackbarAlerta = true;
                        this.alterarAvaliacaoComprovante(params);

                        this.alterarPlanilha({
                            idComprovantePagamento: params.idComprovantePagamento,
                            cdProduto: this.cdProduto,
                            etapa: this.etapa,
                            cdUf: this.cdUf,
                            idmunicipio: this.idmunicipio,
                            stItemAvaliado: this.stItemAvaliado,
                            idPlanilhaItem: this.idPlanilhaItem,
                            stItemAvaliadoAlterado:
                                this.stItemAvaliadoModel[params.idComprovantePagamento],
                        });
                    }).catch(() => {
                        this.snackbarTexto = 'Houve algum problema ao salvar!';
                        this.snackbarAlerta = true;
                    }).then(() => {
                        this.loading = false;
                    });
                }
                return true;
            },
            atualizarComprovantes(loading) {
                let params = '';
                if (typeof this.getUrlParams() !== 'undefined') {
                    params = this.getUrlParams();
                } else {
                    params = `idPronac/${this.idPronac}/uf/${this.uf}/produto/${this.produto}/idmunicipio/${this.idmunicipio}/idPlanilhaItem/${this.idPlanilhaItem}/etapa/${this.etapa}`;
                }

                if (loading) {
                    this.comprovantesIsLoading = true;
                    this.obterDadosItemComprovacao(params).catch().then(() => {
                        this.comprovantesIsLoading = false;
                    });
                    return;
                }
                this.comprovantesIsLoading = false;
                this.obterDadosItemComprovacao(params);
            },
            fecharModal() {
                this.dialog = false;
                this.painelComprovantes = [];
            },
            carregarDadosComprovante(event, index) {
                this.renderDadosComprovante[index] = true;
            },
            justificativaInput(id, value) {
                const dados = {};
                dados[id] = value;

                this.dsJustificativa = Object.assign({}, this.dsJustificativa, dados);
            },
        },
        computed: {
            ...mapGetters({
                dadosItemComprovacao: 'avaliacaoResultados/dadosItemComprovacao',
            }),
        },
    };
</script>