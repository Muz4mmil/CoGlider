import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

interface CustomModalProps {
  visible: boolean
  title: string
  message?: string
  onConfirm: () => void
  onCancel: () => void
}

const CustomModal = ({ visible, title, message, onConfirm, onCancel }: CustomModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className='flex-1 bg-black/50 justify-center items-center px-4'>
        <View className=' bg-white border-2 rounded-[20px] shadow-xl p-6'>
          <Text className='text-center text-2xl font-pbold'>{title}</Text>
          {message && <Text className='text-center text-lg mt-4 font-pregular'>{message}</Text>}

          <View className='flex-row justify-end gap-5 w-full mt-8'>
            <TouchableOpacity onPress={onCancel} className='bg-white border-2 rounded-2xl py-2 px-4 flex-1'>
              <Text className='text-lg text-center font-psemibold mt-0.5'>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm} className='bg-red-200 border-2 rounded-2xl py-2 px-4 flex-1'>
              <Text className='text-lg text-center font-psemibold mt-0.5'>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default CustomModal