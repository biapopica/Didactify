import { HStack, Image, Text } from '@chakra-ui/react'
import { CustomLink } from './CustomLink'
import LogoImage from '@/assets/brain.png'

export default function Logo() {
  return (
    <CustomLink
      to="/"
      fontSize="xl"
      fontWeight="bold"
      textDecoration="none"
      _hover={{ color: 'teal.500' }}
    >
      <HStack gap={3}>
        <Image src={LogoImage} alt="Didactify" boxSize="28px" />
        <Text fontSize="xl" fontWeight="bold" color="white">
          Didactify
        </Text>
      </HStack>
    </CustomLink>
  )
}
