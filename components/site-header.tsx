type SiteHeaderProps = {
  showNav?: boolean
}

export function SiteHeader({showNav = true}: SiteHeaderProps) {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b border-none">
      <div className="bg-background container pr-0 flex h-16 w-full">
        <div className="w-full h-full flex items-center justify-center">
          <img width={128} height={30}  src="https://cdn.discordapp.com/attachments/1155990923801526293/1260690199633985536/semfundopreto1.png?ex=66903cbe&is=668eeb3e&hm=2a8abeb8fd7ecd0fdbe8b3898661a0b0ed6047bc54e9c5ad2aa7ab6aa47c795e&"/>
        </div>
      </div>
    </header>
  )
}
