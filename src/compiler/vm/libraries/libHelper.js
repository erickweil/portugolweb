import { STATE_BREATHING, STATE_DELAY, STATE_DELAY_REPEAT, STATE_ENDED, VM_getDelay } from "../vm.js";

export const libBoolArg = (arg) => {
    if (typeof arg === "number") {
        return arg === 0;
    } else {
        return !!arg;
    }
};

export class BibliotecaBase {
    constructor() {
        this.setTimeout = setTimeout;
        this.members = {};
    }

    resetar() {
        throw new Error("O método resetar deve ser implementado pela biblioteca");
    }

    promisify(fn) {
        const retFn = async (...args) => {
            // Chama a função original da biblioteca
            const result = fn.apply(this, args);
            if(!result || result.state === undefined) {
                return result?.value;
            }

            return new Promise((resolve, reject) => {
                if(result.state === STATE_DELAY) {
                    this.setTimeout(() => resolve(result.value), VM_getDelay());
                } else if(result.state === STATE_BREATHING) {
                    this.setTimeout(() => resolve(result.value), 0);
                } else if(result.state === STATE_DELAY_REPEAT) {
                    this.setTimeout(() => {
                        retFn(...args).then(resolve).catch(reject);
                    }, VM_getDelay());
                } else if(result.state === STATE_ENDED) {
                    reject(new Error("O programa foi finalizado!"));
                } else {
                    reject(new Error("Erro crítico ao chamar biblioteca (Experimente desativar o modo turbo): "+JSON.stringify(result)));
                }
            });
        };
        return retFn;
    }
}