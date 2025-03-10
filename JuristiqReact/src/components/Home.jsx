import SideBar from './sideBar'
import Calendar from './Calender';
import PendingTasks from './PendingTasks';
import Headlines from './Headlines';
import './sideBar.css'
import './Home.css'

function Home() {
  return (
    <div>
      <SideBar />
      <div className='main-content'>
        <div className='upper-content'>
         <Calendar />
         <Headlines />
        </div>
        <div className='lower-content'>
          <PendingTasks />
        </div>
        
      </div>
    </div>
  );
}
export default Home