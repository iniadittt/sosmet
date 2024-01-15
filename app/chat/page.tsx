'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import IconGoogle from '../../public/images/google.png'
import ImageRoom from '../../public/images/room.png'
import { auth } from '../config/firebase-config'
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { db, DB_ROOM, DB_CHAT } from "../config/firebase-config"
import { ref, onValue, set, off, query, orderByChild, limitToLast, get, child, Query} from "firebase/database"
import { v4 as uuidv4 } from 'uuid'

const Dashboard = () => {

  const [user, setUser] = React.useState<any | null>(null)
  const [search, setSearch] = React.useState<string>('')
  const [chatBox, setChatBox] = React.useState<string>('')
  const [selectRoom, setSelectRoom] = React.useState<string>('')
  const [room, setRoom] = React.useState<Array<any> | null>([])
  const [messages, setMessages] = React.useState<Array<any> | null>([])
  const [roomMessages, setRoomMessages] = React.useState<Array<any> | null>([])

  const router = useRouter()

  React.useEffect(() => {
    const userLocalStorage = localStorage.getItem("fb_user")
    if (userLocalStorage) {
      const userObject = JSON.parse(userLocalStorage)
      setUser(userObject)
    }
  }, [])

  React.useEffect(() => {
    const dataRef = ref(db, DB_ROOM)
    const onDataChange = (snapshot: any): any => {
      const dataRoom = snapshot.val()
      if (!dataRoom && !Array.isArray(dataRoom)) {
        setRoom([])
      } else {
        const rooms: any = dataRoom.map((room: any) => {
          return {...room, active: false}
        })
        setRoom(rooms)
      }
    }
    onValue(dataRef, onDataChange)
    return () => off(dataRef, 'value', onDataChange)
  }, [user])

  React.useEffect(() => {
    console.log({room})
  }, [room])
  

  React.useEffect(() => {
    const dataRef = query(
      ref(db, DB_CHAT)
    )
    const onDataChange = (snapshot: any): any => {
      const dataChats = snapshot.val()
      if (!dataChats && !Array.isArray(dataChats)) {
        setMessages([])
        setRoomMessages([])
      } else {
        setMessages(dataChats)
        const RoomMessages = dataChats.filter((chat: any) => chat.roomId === selectRoom)
        setRoomMessages(RoomMessages)
      }
    }
    onValue(dataRef, onDataChange)
    return () => off(dataRef, 'value', onDataChange)
  }, [selectRoom])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const credential: any = GoogleAuthProvider.credentialFromResult(result)
      const access_token: string | null = credential ? credential.accessToken: null
      const token: string | null = credential ? credential.idToken: null
      const { user } = result
      localStorage.setItem("fb_access_token", JSON.stringify(access_token))
      localStorage.setItem("fb_token", JSON.stringify(token))
      localStorage.setItem("fb_user", JSON.stringify(user))
      setUser(user)
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.email
      const credential = GoogleAuthProvider.credentialFromError(error)
      alert(`Error GAuth: ${errorCode} ${errorMessage} ${email} ${credential}`)
    }
  }

  const signOutGoogle = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("fb_access_token")
      localStorage.removeItem("fb_token")
      localStorage.removeItem("fb_user")
      setUser(null)
      router.push('/chat')
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const selectRoomFun = async (e: any, roomId: string) => {
    e.preventDefault()
    if (!roomId) {
      console.error("ID Room Tidak Valid")
      return
    }
    setRoom((prevRoom: any) => prevRoom.map((room: any) => {
      if (room.id === roomId) {
        setSelectRoom(roomId)
        return { ...room, active: true }
      }
      return {...room, active: false}
    }))
  }

  const sendMessage = async(e: any) => {
    e.preventDefault()
    const newMessages = messages || []
      if (chatBox.trim()) {
        const newChat = {
          id: uuidv4(),
          roomId: selectRoom,
          message: chatBox,
          senderId: user.uid,
          timestamp: Date.now()
        }
        newMessages.push(newChat)
        const dataRef = ref(db, DB_CHAT)
        set(dataRef, newMessages)
        setMessages(newMessages)
        setChatBox('')
        const RoomMessages = newMessages.filter((chat: any) => chat.roomId === selectRoom)
        setRoomMessages(RoomMessages)
      }
  }

  return (
    <>
      {user ? (
        <div className='w-full h-full relative pt-24'>
        <div className='fixed top-0 z-50 w-full bg-[#FCF5EB]/50 backdrop-blur-[2px] border-b-2 border-gray-300'>
          <div className='container mx-auto h-full'>
            <nav className='mx-auto w-full h-full lg:py-3 lg:flex lg:justify-between'>
              <h1 className='w-1/3 font-semibold text-2xl my-auto'>SOSMET</h1>
              <div className='w-2/3 lg:flex lg:justify-end my-auto h-full'>
                <button onClick={signOutGoogle} className='py-2 px-9 bg-[#25D366] border-[1px] border-slate-600 text-[#FCF5EB] rounded-3xl'>Logout</button>
              </div>
            </nav>
          </div>
        </div>
        <div className='container mx-auto flex gap-4 rounded-3xl'>
          <div className='w-1/3 flex flex-col gap-4'>
            
            <div className='w-full flex relative'>
              <Image width={24} height={24} src="https://img.icons8.com/ios-filled/50/search--v1.png" alt="search icon" className='absolute top-3 left-2'/>
              <input type="text" name="search" id="search" className='w-full bg-[#FCF5EB] border-2 border-gray-300 pl-10 pr-4 py-2 rounded-md my-auto' onChange={e => setSearch(e.target.value)} value={search} placeholder='Belum Dapat Digunakan' disabled/>
            </div>


            <div id='room' className='w-full bg-[#FCF5EB] pb-4 flex flex-col gap-2 overflow-auto'>
              {
                room &&
                room.map((room: any) => {
                  if(room.active){
                    return <div key={room.id} onClick={e => selectRoomFun(e, room.id)} className='cursor-pointer flex py-2 px-4 gap-4 bg-[#33322d]/20 rounded-md'>
                    <div className='w-1/6 h-[4rem] rounded-[100000px] overflow-hidden my-auto'>
                      <Image src={room.image} alt='ROOM 1' width={128} height={128} className='w-full h-full my-auto'/>
                    </div>
                    <div className='my-auto'>
                      <h1 className='w-full h-7 font-semibold text-xl text-ellipsis overflow-hidden'>{room.nama}</h1>
                      <p className='w-full h-5 text-sm text-ellipsis overflow-hidden'>Lorem ipsum dolor, sit amet!</p>
                    </div>
                  </div>
                  }else{
                    return <div key={room.id} onClick={e => selectRoomFun(e, room.id)} className='cursor-pointer flex py-2 px-4 gap-4 bg-[#33322d]/5 rounded-md'>
                  <div className='w-1/6 h-[4rem] rounded-[100000px] overflow-hidden my-auto'>
                    <Image src={room.image} alt='ROOM 1' width={128} height={128} className='w-full h-full my-auto'/>
                  </div>
                  <div className='my-auto'>
                    <h1 className='w-full h-7 font-semibold text-xl text-ellipsis overflow-hidden'>{room.nama}</h1>
                    <p className='w-full h-5 text-sm text-ellipsis overflow-hidden'>Lorem ipsum dolor, sit amet!</p>
                  </div>
                </div>
                  }
                })
              }
          </div>

          </div>
          <div id='message' className='w-2/3 h-[82vh] px-4 flex flex-col gap-4'>
            <div className='h-full overflow-auto pr-4 flex flex-col gap-2'>
            { 
              selectRoom && messages && roomMessages && roomMessages.length > 0 ? 
                roomMessages.map((message: any, index: any) => {
                  if(message.senderId !== user.uid){
                    return <div key={index} className='w-full flex justify-start gap-4'>
                      <div className='w-3/4 p-2 flex gap-2'>
                        <div className='w-1/12 h-12 rounded-full overflow-hidden border-2 border-gray-700'>
                          <Image src={ImageRoom} alt='Me' width={32} height={32} className='w-full h-full m-auto'/>
                        </div>
                        <div className='w-3/4 flex justify-start'>
                          <p className='max-w-fit bg-[#33322d]/10 text-left w-11/12 py-3 px-4 rounded-lg'>{message.message}</p>
                        </div>
                      </div>
                    </div>
                  }else{
                    return <div key={index} className='w-full flex justify-end gap-4'>
                      <div className='w-3/4 flex justify-end'>
                        <p className='max-w-max bg-[#33322d]/10 text-right py-3 px-4 rounded-lg'>{message.message}</p>
                      </div>
                    </div>
                  }
                }
              ):
              <div className='w-full h-full bg-[#33322d]/10 rounded-lg p-4'>
                Pesan Tidak Ada
              </div>
            }
            </div>
            {
              selectRoom &&
              <form onSubmit={sendMessage}>
                <div className='w-full flex relative'>
                  <Image width={24} height={24} src="https://img.icons8.com/material-rounded/24/filled-sent.png" alt="send icon" className='absolute top-5 right-4 cursor-pointer'/>
                  <input type="text" name="search" id="search" className='w-full bg-[#FCF5EB] border-2 border-gray-300 pr-14 pl-4 py-4 rounded-md my-auto' value={chatBox} onChange={e => setChatBox(e.target.value)}/>
                </div>
              </form>
            }
          </div>
          





























        </div>
      </div>
      ) : (
        <div className='w-full h-screen bg-[#FCF5EB] flex justify-center'>
          <div className='w-1/3 h-80 my-auto p-8 bg-white rounded-2xl shadow-2xl flex flex-col justify-between'>
            <h1 className='text-4xl font-bold text-center'>Masuk Sosmet</h1>
            <p className='text-sm'>Berkirim pesan secara pribadi kepada orang terdekat. Sosmet berkomitmen menghubungkan kita dimana saja dan kapan saja.</p>
            <button onClick={signInWithGoogle} className='w-full mb-8 bg-[#F5F5F5] py-2 flex justify-center gap-4 rounded-md shadow-md'>
              <Image src={IconGoogle} alt='Google Icon' priority={true} width={18} height={18} className='my-auto'/>
              <span className='my-auto text-sm text-[#558AED] font-semibold'>Masuk Dengan Google</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Dashboard