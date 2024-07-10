"use client"
import Link from "next/link"

import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/components/ui/command"
import {  ReloadIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Dialog } from "@/components/ui/dialog"
import { SiteHeader } from "@/components/site-header"

interface cityInter {
    municipio: string
    total: number
    mulheres: number
    vagas: number
    homens: number
    id: number
    habitantes: number
}

export default function IndexPage() {
    const [loading, setLoading] = useState<boolean>(true)
    const [open, setOpen] = useState(false)
    const [votesQtn, setVotesQtn] = useState("")
    const [showNewTeamDialog, setShowNewTeamDialog] = useState(false)
    const [citys, setCitys] = useState([] as Array<cityInter>)
    const [currentCity, setCurrentCity] = useState<cityInter>()
    const [QE, setQE] = useState(0)
    const [QP, setQP] = useState(0)
    const [B, setB] = useState(0)
    const [MB, setMB] = useState(0)

    useEffect(() => {
        async function l() {
            var res = await fetch("/api/eleitorado", {
                method: "GET",
                headers: {
                    "origin": "publicanet.tre-es.jus.br",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                },
            })
            var data = await res.json()
            setCitys(data)
            setLoading(false)
        }
        l()
    }, [])


    if(loading) {
        return (
            <section className="container grid items-center justify-center gap-6 pb-8 pt-6 md:py-10">
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin text-center m-auto" />
            </section>
        )
    }

    const handleChange = function(val: string) {
        if(!currentCity?.total || !currentCity?.vagas) return
        if(Number(val) > currentCity?.total) {
            setVotesQtn("")
            return  alert("Valor inválido")
        }
        var tqe = Math.round((Number(val) / currentCity?.vagas))
        setQE(tqe)
        var tqp = Math.round((Number(val) / tqe))
        setQP(tqp ?? 0)
        var tb = Math.round((10 / 100) * tqe)
        setB(tb)
        setVotesQtn(val)
    }
  
  return (
    <>
        <SiteHeader />
        <section className="container grid items-center justify-center gap-6 pb-8 pt-6 md:py-10">
            <div className="flex max-w-full items-center justify-center gap-2">
                <Card className="w-[350px]">
                    <CardHeader className="text-center">
                        <CardTitle>Calculadora de votos</CardTitle>
                    </CardHeader>
                    <CardContent className="w-full mb-4">
                        <div className="w-full mb-4">
                            <Label className="font-bold">Cidade</Label>
                            <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild className="w-full">
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            aria-label="Selecione uma cidade"
                                            className={cn("w-full justify-between")}
                                        >
                                            {currentCity ? (
                                                <>
                                                    {currentCity?.municipio} ({currentCity?.total.toLocaleString("pt-br")})
                                                </>
                                            ) : ""}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[250px] p-0">
                                        <Command className="w-full">
                                            <CommandInput className="w-full" placeholder="Digite a cidade" />
                                            <CommandList className="w-full">
                                                {citys.map((city: cityInter, i: number) => (
                                                    <>
                                                        <CommandItem
                                                            key={i}
                                                            onSelect={() => {
                                                                setCurrentCity(city)
                                                                setOpen(false)
                                                                setVotesQtn("")
                                                            }}
                                                            className="text-sm w-full">
                                                            {city.municipio} ({city.total.toLocaleString("pt-br")})
                                                        </CommandItem>
                                                    </>
                                                ))}
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </Dialog>
                        </div>
                        <div className="w-full mb-4">
                            <Label className="font-bold">Votos validos (aproximados)</Label>
                            <Input value={votesQtn} maxLength={String(currentCity?.total).length} type={"text"} onChange={(evt) => { handleChange(evt.target.value) }}/>
                        </div>
                        <div className="w-full mb-4">
                            {currentCity ? (
                                <>
                                    <h2 className="font-bold">TOTAL DE ELEITORADO: {Number(currentCity?.total).toLocaleString('pt-br')} </h2>
                                    <h2 className="font-bold">HABITANTES: {Number(currentCity?.habitantes).toLocaleString('pt-br') || 0}</h2>
                                    <h2 className="font-bold">CADEIRAS: {Number(currentCity?.vagas).toLocaleString('pt-br') || 0}</h2>
                                    <h2 className="font-bold">QUOCIENTE ELEITORAL (QE): {Number(QE).toLocaleString('pt-br') || 0}</h2>
                                    <h2 className="font-bold">QUOCIENTE PARTIDÁRIO (QP): {Number(QP).toLocaleString('pt-br') || 0}</h2>
                                    <h2 className="font-bold">CLAÚSULA DE BARREIRA (CB): {B}</h2>
                                </>
                            ) : ""}
                        </div>
                    </CardContent>
                </Card> 
            </div>
        </section>
    </>
  )
}
