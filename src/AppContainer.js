import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import Renderer3D from './3DRenderer';
import AppSettings from './components/AppSettingsTab';

export default function AppContainer(props) {
    const [activeTab, setActiveTab] = useState('1');
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink className={activeTab == '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>
              3D Renderer
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab == '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>
              Midi to 3D Mapper
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent style={{"height": "100%"}} activeTab={activeTab}>
          <TabPane tabId="1">
              <Renderer3D store={props.store}/>
          </TabPane>
          <TabPane tabId="2">
              <AppSettings/>
          </TabPane>
        </TabContent>
      </div>
    );
  }