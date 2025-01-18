

function SideBar() {
  return (
    <div className="sideBar">
        <div className="logo">JuristiQ</div>
        <div className="search">Search</div>
        <div className="options">
            <ul className="list-items">
                <li>My Cases</li>
                <li>Clients</li>
                <li>Fees</li>
                <li>Profile</li>
            </ul>
        </div>
        <hr/>
        <button className="logout-button">Log Out</button>
    </div>
  )
}

export default SideBar