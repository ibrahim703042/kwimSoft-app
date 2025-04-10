import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MenuButton: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => (
  <Button 
    variant="ghost" 
    size="icon" 
    className="md:hidden mr-2" 
    onClick={onMenuClick}
  >
    <Menu className="h-6 w-6" />
  </Button>
);

export default MenuButton;
