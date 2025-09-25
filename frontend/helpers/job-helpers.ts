import { categoryLabels, regionNames } from "@/constants/jobConstants";

      // Helper function to parse location data
      export  const parseLocation = (location: any) => {
        if (!location) return null;
        
        // If location is already an object, return it
        if (typeof location === 'object' && location.region && location.city) {
          return location;
        }
        
        // If location is a string (JSON), try to parse it
        if (typeof location === 'string') {
          try {
            return JSON.parse(location);
          } catch (error) {
            console.warn('Failed to parse location JSON:', location);
            return null;
          }
        }
        
        return null;
      };
    
      // Helper function to format region names
      export const formatRegion = (region: string) => {
        if (!region) return 'N/A';
        return regionNames[region as keyof typeof regionNames] || 
               region.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      };
    
      // Helper function to format category names
      export const formatCategory = (category: string) => {
        
        if (!category) return 'N/A';
        
        // Use the simple categoryLabels mapping
        return categoryLabels[category] || category.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      };
    
      // Helper function to format location display
      export const formatLocationDisplay = (location: any) => {
        const parsed = parseLocation(location);
        if (!parsed) return 'Location not specified';
        
        const city = parsed.city || '';
        const region = formatRegion(parsed.region);
        
        if (city && region !== 'N/A') {
          return `${city}, ${region}`;
        } else if (city) {
          return city;
        } else if (region !== 'N/A') {
          return region;
        }
        
        return 'Location not specified';
      };
    
      // Helper functions for profile handling
      export const getProfilePhoto = (user: any) => {
        if (user?.profile_photo) {
          return user.profile_photo;
        }
        
        if (user?.metadata?.profile?.photo) {
          return user.metadata.profile.photo;
        }
        
        if (user?.parsedMetadata?.profile?.photo) {
          return user.parsedMetadata.profile.photo;
        }
        
        return null;
      };
    
      export const getDisplayName = (user: any) => {
        if (user?.display_name) {
          return user.display_name;
        }
        
        if (user?.first_name && user?.last_name) {
          return `${user.first_name} ${user.last_name}`;
        }
        
        return user?.name || 'Unknown User';
      };
    
      export const getInitials = (user: any) => {
        if (user?.first_name && user?.last_name) {
          return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
        }
        
        if (user?.display_name) {
          return user.display_name.split(' ')
            .map((word: string) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
        }
        
        if (user?.name) {
          return user.name.split(' ')
            .map((word: string) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
        }
        
        return 'U';
      };

    export const formatBudget = (min: number, max: number) => {
        return `GHS ${min.toLocaleString()} - ${max.toLocaleString()}`;
    };

    export const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
        });
    };