import { UIContext } from "@/context"
import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material"
import NextLink from "next/link"
import { useContext } from "react"

export const AdminNavbar = () => {

  const { toggleSideMenu } = useContext(UIContext)

  return (
    <AppBar>
      <Toolbar>
        <NextLink href='/' passHref legacyBehavior>
          <Link display='flex' alignItems='center'>
            <Typography variant='h6'>Teslo |</Typography>
            <Typography sx={{ marginLeft: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Button onClick={toggleSideMenu}>
          Menu
        </Button>

      </Toolbar>
    </AppBar>
  )
}


