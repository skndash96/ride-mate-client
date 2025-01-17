import React from 'react'
import { Link, Redirect, Route, Switch, useLocation } from 'wouter'
import { FaCar, FaLink, FaPeopleGroup } from 'react-icons/fa6';
import MyRide from './MyRide';
import Suggestions from './Suggestions';
import Invites from './Invites';
import { useRide } from '../../hooks/useRide';
import NoCurrentRide from '../../components/NoCurrentRide';

export default function Home() {
  const [path, setPath] = useLocation();
  const { currentRide } = useRide();

  if (!currentRide) {
    return (
      <div className='grow'>
        <NoCurrentRide />
      </div>
    );
  }

  return (
    <div className='grow flex flex-col'>
      <div className='grow'>
        <Switch>
          <Route path="/my-ride" component={MyRide} />
          <Route path="/invites" component={Invites} />
          <Route path="/suggestions" component={Suggestions} />
          <Route component={() => <Redirect to="/my-ride" />} />
        </Switch>
      </div>

      <div className='p-4 pb-1 flex items-center justify-center gap-4'>
        {[
          {
            title: 'My Ride',
            icon: <FaCar size={20} />,
            href: '/my-ride'
          }, {
            title: 'Invites',
            icon: <FaLink size={20} />,
            href: '/invites'
          }, {
            title: 'Connect',
            icon: <FaPeopleGroup size={20} />,
            href: '/suggestions'
          }
        ].map(({ title, icon, href }) => (
          <Link key={href} to={href} className={`px-4 py-2 h-auto btn btn-ghost rounded-3xl ${path === href ? 'bg-neutral-900 hover:bg-neutral-700 text-white' : 'opacity-50'}`}>
            {icon}
            {href === path && <small>{title}</small>}
          </Link>
        ))}
      </div>
    </div>
  )
}
