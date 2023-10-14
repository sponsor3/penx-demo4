import { Box } from '@fower/react'
import { LogOut, MoreHorizontal, StarOff, Trash2 } from 'lucide-react'
import {
  Button,
  MenuItem,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'
import { useDoc } from '@penx/hooks'
import { store } from '@penx/store'

export const MorePopover = () => {
  const { doc } = useDoc()

  if (!doc) return null

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" colorScheme="gray500" isSquare>
          <MoreHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent w-260 column>
        <PopoverClose>
          <MenuItem
            gap2
            onClick={async () => {
              // await store.trashDoc(doc.id)
              console.log('docId:', doc.id, store.getDoc().id)
              await store.trashDoc(store.getDoc().id)
            }}
          >
            <Trash2 size={18} />
            <Box>Delete</Box>
          </MenuItem>
        </PopoverClose>

        <MenuItem gap2 onClick={async () => {}}>
          <StarOff size={18} />
          <Box>Remove from Favorites</Box>
        </MenuItem>

        <MenuItem gap2 onClick={async () => {}}>
          <LogOut size={18} />
          <Box>Export</Box>
        </MenuItem>
      </PopoverContent>
    </Popover>
  )
}