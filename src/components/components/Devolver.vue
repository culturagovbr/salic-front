<template>
    <v-dialog
        v-if=" typeof usuario !== 'undefined' && Object.keys(usuario).length > 0"
        v-model="dialog"
        width="650"
    >
        <v-tooltip slot="activator" bottom>
            <v-btn
                slot="activator"
                color="green lighten-2"
                text="white"
                flat
                icon
                light
            >
                <v-icon color="error" class="material-icons">undo</v-icon>
            </v-btn>
            <span>Devolver Projeto</span>
        </v-tooltip>
        <v-card>
            <v-container grid-list-md>
                <v-card-text>
                    Você deseja devolver o projeto '{{ pronac }} - {{ nomeProjeto }}' para análise do Tecnico: {{tecnico.nome}}?
                    <v-textarea
                        v-model="justificativa"
                        outline
                        name="input-7-4"
                        label="Justificativa"
                        ></v-textarea>
                </v-card-text>
            </v-container>
            <v-card-actions>
                <v-btn
                    color="success"
                    flat
                    @click="devolver()"
                >
                    Sim
                </v-btn>
                <v-btn
                    color="error"
                    flat
                    @click="dialog = false"
                >
                    Não
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

import { mapActions } from 'vuex';

export default {
    name: 'Devolver',
    data() {
        return {
            dialog: false,
            justificativa: '',
        };
    },
    props: {
        idPronac: String,
        usuario: Object,
        atual: String,
        proximo: String,
        nomeProjeto: String,
        pronac: String,
        idTipoDoAtoAdministrativo: {
            type: String,
            default: '',
            validator(value) {
                return ['622', '623'].includes(value);
            },
        },
        tecnico: Object,
    },
    methods: {
        ...mapActions({
            setDevolverProjeto: 'avaliacaoResultados/devolverProjeto',
        }),
        devolver() {
            this.dialog = false;

            const dados = {
                idPronac: this.idPronac,
                atual: this.atual,
                proximo: this.proximo,
                idTipoDoAtoAdministrativo: this.idTipoDoAtoAdministrativo,
                justificativa: this.justificativa,
                usuario: this.usuario,
                /* encaminhamento */
                dsJustificativa: this.justificativa,
                idOrgaoDestino: 1,
                /* agente */
                idAgenteDestino: this.tecnico.idAgente,
                cdGruposDestino: 1,
                dtFimEncaminhamento: '2015-09-25 10:38:41',
                idSituacaoEncPrestContas: 1,
                idSituacao: 1,
            };

            this.setDevolverProjeto(dados);
        },
    },
};
</script>
