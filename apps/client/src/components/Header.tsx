import { authClient } from '@/lib/auth-client'
import { Button, Flex, Portal } from '@chakra-ui/react'
import { CustomLink } from './CustomLink'
import { Menu } from '@chakra-ui/react'
import Logo from './Logo'
import { useLogout } from '@/hooks/useLogout'

export default function Header() {
  const { data: session } = authClient.useSession()
  const isAuthenticated = !!session?.user
  const { logout } = useLogout()

  return (
    <Flex
      as="nav"
      width="100%"
      bg="black"
      align="center"
      justify="center"
      py={4}
    >
      <Flex width="80%" align="center" justify="space-between">
        <Logo />
        {isAuthenticated ? (
          <Menu.Root positioning={{ placement: 'bottom-end' }}>
            <Menu.Trigger asChild>
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="profile">Profile</Menu.Item>
                  <Menu.Item value="friends">Friends</Menu.Item>
                  <Menu.Item
                    value="log-out"
                    color="fg.error"
                    _hover={{ bg: 'bg.error', color: 'fg.error' }}
                    onClick={logout}
                  >
                    Log out
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        ) : (
          <Flex gap={4} align="center">
            <CustomLink
              to="/login"
              fontWeight="500"
              color="gray.600"
              textDecoration="none"
              px={4}
              py={2}
              borderRadius="md"
              transition="all 0.2s"
              _hover={{
                color: 'teal.400',
              }}
              _active={{
                color: 'teal.400',
              }}
            >
              Log in
            </CustomLink>

            <CustomLink
              to="/signup"
              fontWeight="500"
              color="gray.950"
              bg="teal.400"
              textDecoration="none"
              px={6}
              py={2}
              borderRadius="md"
              transition="all 0.2s"
              _hover={{
                bg: 'teal.300',
              }}
              _active={{
                bg: 'teal.300',
              }}
            >
              Sign up
            </CustomLink>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
