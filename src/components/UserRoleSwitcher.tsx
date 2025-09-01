import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockCommunities } from "@/types/community";

export const UserRoleSwitcher = () => {
  const { user, setUser } = useAuth();

  const mockUsers = {
    admin: {
      id: '1',
      name: 'Admin User',
      role: 'admin' as const,
    },
    communityUser: {
      id: '2', 
      name: 'Community User',
      role: 'community_user' as const,
      communityId: '1',
      community: mockCommunities.find(c => c.id === '1'),
    }
  };

  const handleRoleSwitch = () => {
    if (user?.role === 'admin') {
      setUser(mockUsers.communityUser);
    } else {
      setUser(mockUsers.admin);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
      <div className="flex items-center gap-2">
        {user?.role === 'admin' ? (
          <Shield className="w-4 h-4 text-blue-600" />
        ) : (
          <User className="w-4 h-4 text-green-600" />
        )}
        <span className="text-sm font-medium">{user?.name}</span>
        <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
          {user?.role === 'admin' ? 'Admin' : 'Community User'}
        </Badge>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRoleSwitch}
        className="ml-auto"
      >
        Switch to {user?.role === 'admin' ? 'Community User' : 'Admin'}
      </Button>
    </div>
  );
};