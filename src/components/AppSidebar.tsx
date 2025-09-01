
import { Home, Activity, Users, UserPlus, Building, Phone, Calendar, MessageSquare, FileText, Bell, Settings, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTemplate } from "@/contexts/TemplateContext";
import { UserRoleSwitcher } from "@/components/UserRoleSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { getPublishedTemplatesForCommunity, templates, getPrimaryTemplateForCommunity } = useTemplate();
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(true);

  // Get templates based on user role
  const availableTemplates = isAdmin 
    ? templates // Admin sees all templates
    : (user?.communityId ? getPublishedTemplatesForCommunity(user.communityId) : []);
  
  const primaryTemplate = user?.communityId 
    ? getPrimaryTemplateForCommunity(user.communityId)
    : null;
  
  return (
    <Sidebar className="bg-white text-black border-r">
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">ALINE</h2>
        <p className="text-xs text-gray-600 mt-1">AG Reports & Lists Management</p>
        <div className="mt-3">
          <UserRoleSwitcher />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                {isAdmin ? (
                  // Admin view: Dashboard with all template submenu
                  <>
                    <SidebarMenuButton 
                      onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
                      className={`text-gray-700 hover:bg-gray-100 font-medium ${
                        location.pathname === '/' || location.pathname.startsWith('/template/') ? 'bg-gray-100' : ''
                      }`}
                    >
                      <Home className="mr-3 h-4 w-4" />
                      <span>Dashboard</span>
                      {availableTemplates.length > 0 && (
                        <ChevronRight 
                          className={`ml-auto h-4 w-4 transition-transform ${
                            isDashboardExpanded ? 'rotate-90' : ''
                          }`} 
                        />
                      )}
                    </SidebarMenuButton>
                    
                    {isDashboardExpanded && availableTemplates.length > 0 && (
                      <SidebarMenuSub>
                        {availableTemplates.map((template) => (
                          <SidebarMenuSubItem key={template.id}>
                            <SidebarMenuSubButton 
                              asChild
                              className={location.pathname === `/template/${template.id}` ? 'bg-muted' : ''}
                            >
                              <Link to={`/template/${template.id}`}>
                                <span>{template.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </>
                ) : (
                  // Community user view: Primary template as default, others as submenu
                  <>
                    <SidebarMenuButton 
                      onClick={() => {
                        if (availableTemplates.length > 1) {
                          setIsDashboardExpanded(!isDashboardExpanded);
                        }
                      }}
                      className={`text-gray-700 hover:bg-gray-100 font-medium ${
                        location.pathname === '/' ? 'bg-gray-100' : ''
                      }`}
                    >
                      <Link to="/" className="flex items-center flex-1">
                        <Home className="mr-3 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      {availableTemplates.length > 1 && (
                        <ChevronRight 
                          className={`ml-auto h-4 w-4 transition-transform ${
                            isDashboardExpanded ? 'rotate-90' : ''
                          }`} 
                        />
                      )}
                    </SidebarMenuButton>
                    
                    {isDashboardExpanded && availableTemplates.length > 1 && (
                      <SidebarMenuSub>
                        {availableTemplates
                          .filter(template => template.id !== primaryTemplate?.id)
                          .map((template) => (
                            <SidebarMenuSubItem key={template.id}>
                              <SidebarMenuSubButton 
                                asChild
                                className={location.pathname === `/template/${template.id}` ? 'bg-muted' : ''}
                              >
                                <Link to={`/template/${template.id}`}>
                                  <span>{template.name}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                      </SidebarMenuSub>
                    )}
                  </>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <Activity className="mr-3 h-4 w-4" />
                  <span>Activity</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 text-xs font-medium uppercase tracking-wide px-2">People</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <Users className="mr-3 h-4 w-4" />
                  <span>Prospects</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <UserPlus className="mr-3 h-4 w-4" />
                  <span>Pre Lead</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <Building className="mr-3 h-4 w-4" />
                  <span>Resident</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <Phone className="mr-3 h-4 w-4" />
                  <span>Referral Source</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <Users className="mr-3 h-4 w-4" />
                  <span>Contact</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <Building className="mr-3 h-4 w-4" />
                  <span>Organization</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <FileText className="mr-3 h-4 w-4" />
                  <span>Saved Lists</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <FileText className="mr-3 h-4 w-4" />
                  <span>Lists</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <Calendar className="mr-3 h-4 w-4" />
                  <span>Calendar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <MessageSquare className="mr-3 h-4 w-4" />
                  <span>Conversations</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <FileText className="mr-3 h-4 w-4" />
                  <span>Templates</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <Bell className="mr-3 h-4 w-4" />
                  <span>Notifications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
                  <Calendar className="mr-3 h-4 w-4" />
                  <span>Campaign / Events</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild
                className={`text-gray-700 hover:bg-gray-100 ${
                  location.pathname.startsWith('/admin') ? 'bg-gray-100' : ''
                }`}
                  >
                    <Link to="/admin">
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
