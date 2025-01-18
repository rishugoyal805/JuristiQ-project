import SideBar from './sideBar'
import Calendar from './Calender';
import PendingTasks from './PendingTasks';
import Headlines from './Headlines';
import './sideBar.css'

function Home() {
  return (
    <div>
    <SideBar/>
    <div className='main-content'>
    <Calendar />
    <PendingTasks />
    <Headlines />
    </div>
    </div>
  )
}

export default Home