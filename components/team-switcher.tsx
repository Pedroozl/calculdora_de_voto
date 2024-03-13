"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GetSessionInfo } from "@/modules/session-check"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const groups = [
  {
    label: "Contas",
    teams: Array<any>(),
  },
]

type Team = (typeof groups)[number]["teams"][number]

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null)
  const [err, setError] = React.useState<boolean>(false)

  React.useEffect(() => {
    async function a() {
      var data = await GetSessionInfo()
      if(!data){
        setLoading(false)
        setError(true)
        return
      }
      var currentAccD: any;
      var currentAcc: any = localStorage.getItem("currentAcc")
      if(currentAcc && currentAcc != null && currentAcc != undefined) {
        currentAcc = JSON.parse(currentAcc).value
      }
      data.acc_data.forEach(async (d: any, ii: number) => {
        var dd: any = {
          label: d.user.global_name,
          value: d.user.id,
          avatar: "https://cdn.discordapp.com/avatars/"+d.user.id+"/"+d.user.avatar+".jpg?size=2048"
        }
        if(currentAcc && d.user.id == currentAcc) currentAccD = dd
        groups[0].teams.push(dd)
      })
      console.log(currentAccD)
      if(!currentAccD) {
        localStorage.setItem("currentAcc", JSON.stringify(groups[0].teams[0]))
        setSelectedTeam(groups[0].teams[0])
      } else {
        localStorage.setItem("currentAcc", JSON.stringify(currentAccD))
        setSelectedTeam(currentAccD)
      }
      setLoading(false)
      return;
    }
    a()
  }, [])

  const handleOpenApp = function() {

  }

  if(loading) {
    return <>
      <h2>Carregando</h2>
    </>
  }

  console.log(err)
  if(err) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ocorreu um error com suas credenciais</AlertDialogTitle>
            <AlertDialogDescription>
              Que tal tentar se conectar novamente?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              return location.href = "/"
            }}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleOpenApp}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={selectedTeam?.avatar}
                alt={selectedTeam?.label}
                className="grayscale"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedTeam.label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map((team) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        localStorage.setItem("currentAcc", JSON.stringify(team))
                        setSelectedTeam(team)
                        setOpen(false)
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={team.avatar}
                          alt={team.label}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {team.label} 
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}