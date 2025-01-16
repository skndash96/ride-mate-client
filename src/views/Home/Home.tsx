import React, { useEffect } from 'react'
import { Link, Redirect, Route, Switch, useLocation } from 'wouter'
import { useRide } from '../../hooks/useRide';
import { FaCar, FaLink, FaPeopleGroup } from 'react-icons/fa6';
import MyRide from './MyRide';
import Suggestions from './Suggestions';


export default function Home() {
  const [path, setPath] = useLocation();

  return (
    <div className='grow flex flex-col'>
      <div className='grow h-full overflow-auto'>
        <Switch>
          <Route path="/my-ride" component={MyRide} />
          <Route path="/suggestions" component={Suggestions} />
          <Route component={() => <Redirect to="/my-ride" />} />
        </Switch>
      </div>

      <div className='p-4 pb-1 grid grid-cols-2 gap-4'>
        {[
          {
            title: 'My Ride',
            icon: <FaCar />,
            href: '/my-ride'
          }, {
            title: 'Suggestions',
            icon: <FaPeopleGroup size={20} />,
            href: '/suggestions'
          }
        ].map(({ title, icon, href }) => (
          <Link to={href} className={`py-2 h-auto btn btn-sm btn-ghost rounded-3xl ${path === href ? 'bg-neutral-900 hover:bg-neutral-700 text-white' : 'opacity-50'}`}>
            {icon}
            {title}
          </Link>
        ))}
      </div>
    </div>
  )
}
