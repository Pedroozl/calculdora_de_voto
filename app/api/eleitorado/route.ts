import { NextRequest, NextResponse } from "next/server"
import fs, { write } from "fs"
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function GET(req: NextRequest) {
    var data: any = JSON.parse(await fs.readFileSync(path.join(__dirname) + "/data.json").toString())
    return NextResponse.json(data, {
        status: 200
    })
}

async function writeonceone(tmp: any) {
    await fs.writeFileSync(path.join(__dirname) + "/data.json", JSON.stringify(tmp))
}

/*var qtt = await getQntt(municipio.habitantes)
        municipio.vagas = qtt
        for(var ii = 0; ii < data2.length; ii++) {
            var val: any = data2[ii]
            if(val.nome.toLowerCase() == municipio.municipio.toLowerCase()) {
                var res = await fetch("https://servicodados.ibge.gov.br/api/v1/pesquisas/-/indicadores/97907/resultados/"+val.id, {
                    method: "get"
                })
                var  dataj = await res.json()
                dataj = Number(dataj[0].res[0].res['2022'])
                municipio.id = val.id
                municipio.habitantes = dataj
            }
        }
        
        interface data {
    min: number
    max: number
    vagas: number
}

async function getQntt(valor: number) {
    var data = JSON.parse(await fs.readFileSync(path.join(__dirname) + "/vagas.json").toString())
    var t = 0
    for(var i = 0; i < data.length; i++) {
        var val: data = data[i]
        if(val.min == 0 && valor <= val.min || valor > val.min && valor <= val.max || val.max == 0 && valor > val.min) {
            t = val.vagas
        }
    }
    return t
}*/