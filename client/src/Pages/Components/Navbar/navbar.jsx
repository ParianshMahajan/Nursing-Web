
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button as ButtonMaterial } from "@mui/material"
import { Button } from "../../../components/ui/button"

const navMap = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Find Nurses", link: "/search" },
  { name: "Contact Us", link: "/contact" },
]

export function Navbar() {
  return (
    (<header
      className="fixed top-0 z-50 w-full border-b dark:border-gray-800 dark:bg-gray-950"
      style={{
        background: "rgba( 255, 255, 255, 0.1 )",
        backdropFilter: "blur( 7px )",
        pt: 3,
        px: 15,
      }}>
      <div
        className="container mx-auto flex h-24 max-w-6xl items-center justify-between px-4 md:px-6"
        >
        <a href="/" className="flex items-center gap-2" >
          <p style={{ fontSize: "42px", fontWeight: "500", padding: 0, margin: 0 }}
                    className="tapovan"
                >तपोवन्</p>

        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
         {navMap.map((item, index) => (
          <a
            key={index}
            href={item.link}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            style={{ fontSize: "18px", fontWeight: "500" }}
            >
            {item.name}
          </a>
        ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-sm font-medium md:flex">
            <ButtonMaterial variant="contained" color="primary" href="/login/user">
              Login
            </ButtonMaterial>   
          </div>
        
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="md:hidden">
              <div className="grid gap-4 p-4">
              {navMap.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                  {item.name}
                </a>
              ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>)
  );
}

function MenuIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>)
  );
}





