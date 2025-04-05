import React from 'react'

interface HeaderProps {
    title: string,
    children: string,
}

export const Header = ({ title, children }: HeaderProps) => {
    return (
        <div className='flex flex-col items-center space-y-3 md:space-y-5'>
            <div className='uppercase text-[#BD8AFC] tracking-widest text-sm'>
                {title}
            </div>
            <div className='text-[#F3F4F6] text-3xl md:text-4xl text-center font-semibold'>
                {children}
            </div>
        </div>
    )
}