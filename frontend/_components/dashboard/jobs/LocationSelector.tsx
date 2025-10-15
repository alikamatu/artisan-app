"use client";

import React, { useState, useMemo } from 'react';
import { Search, MapPin, ChevronDown, ChevronUp, X, Navigation } from 'lucide-react';
import { GhanaRegion } from '@/lib/types/jobs';
import { GHANA_REGIONS, getRegionsBySearch } from '@/constants/jobConstants';

interface LocationData {
  region: GhanaRegion | '';
  city: string;
  specific_address?: string;
}

interface LocationSelectorProps {
  value: LocationData;
  onChange: (location: LocationData) => void;
  error?: string;
  disabled?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  error,
  disabled = false
}) => {
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [regionSearch, setRegionSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const filteredRegions = useMemo(() => {
    if (!regionSearch) return Object.values(GHANA_REGIONS);
    return getRegionsBySearch(regionSearch);
  }, [regionSearch]);

  const selectedRegionInfo = value.region ? GHANA_REGIONS[value.region] : null;

  const availableCities = useMemo(() => {
    if (!selectedRegionInfo) return [];
    const allLocations = [...selectedRegionInfo.cities, ...selectedRegionInfo.popularAreas];
    if (!citySearch) return allLocations;
    return allLocations.filter(location => 
      location.toLowerCase().includes(citySearch.toLowerCase())
    );
  }, [selectedRegionInfo, citySearch]);

  const handleRegionSelect = (region: GhanaRegion) => {
    onChange({
      ...value,
      region,
      city: '', // Reset city when region changes
      specific_address: value.specific_address
    });
    setIsRegionOpen(false);
    setRegionSearch('');
  };

  const handleCitySelect = (city: string) => {
    onChange({
      ...value,
      city
    });
    setIsCityOpen(false);
    setCitySearch('');
  };

  const clearRegion = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({
      region: '',
      city: '',
      specific_address: value.specific_address
    });
  };

  const clearCity = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({
      ...value,
      city: ''
    });
  };

  // Geolocation functionality
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you'd reverse geocode these coordinates
        console.log('Coordinates:', position.coords.latitude, position.coords.longitude);
        // For now, we'll just suggest Greater Accra as a default
        onChange({
          ...value,
          region: GhanaRegion.GREATER_ACCRA,
          city: 'Accra'
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please select manually.');
      }
    );
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <MapPin className="h-4 w-4" />
        Location *
      </label>

      {/* Current Location Button */}
      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Navigation className="h-4 w-4" />
        Use Current Location
      </button>

      {/* Region Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">Region</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsRegionOpen(!isRegionOpen)}
            disabled={disabled}
            className={`w-full px-4 py-3 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className="flex items-center justify-between">
              <span className={selectedRegionInfo ? 'text-gray-900' : 'text-gray-500'}>
                {selectedRegionInfo ? selectedRegionInfo.name : 'Select region'}
              </span>
              <div className="flex items-center gap-2">
                  {selectedRegionInfo && !disabled && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        clearRegion(e);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </span>
                  )}
                {!disabled && (
                  isRegionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>
          </button>

          {isRegionOpen && !disabled && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
              {/* Search */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={regionSearch}
                    onChange={(e) => setRegionSearch(e.target.value)}
                    placeholder="Search regions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Regions List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredRegions.length > 0 ? (
                  filteredRegions.map((region) => (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => handleRegionSelect(region.id)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        value.region === region.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">{region.name}</div>
                      <div className="text-sm text-gray-500">
                        {region.cities.slice(0, 3).join(', ')}
                        {region.cities.length > 3 && ` +${region.cities.length - 3} more`}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <Search className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <div>No regions found</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* City Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">City/Area</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && selectedRegionInfo && setIsCityOpen(!isCityOpen)}
            disabled={disabled || !selectedRegionInfo}
            className={`w-full px-4 py-3 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } ${disabled || !selectedRegionInfo ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className="flex items-center justify-between">
              <span className={value.city ? 'text-gray-900' : 'text-gray-500'}>
                {value.city || (selectedRegionInfo ? 'Select city/area' : 'Select region first')}
              </span>
              <div className="flex items-center gap-2">
                {value.city && !disabled && selectedRegionInfo && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      clearCity(e);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </span>
                )}
                {!disabled && selectedRegionInfo && (
                  isCityOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>
          </button>

          {isCityOpen && selectedRegionInfo && !disabled && (
            <div className="absolute top-full left-0 right-0 z-40 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
              {/* Search */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="Search cities and areas..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Cities List */}
              <div className="max-h-48 overflow-y-auto">
                {availableCities.length > 0 ? (
                  availableCities.map((city, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        value.city === city ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">{city}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <Search className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <div>No cities found</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Specific Address */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          Specific Address/Landmark (Optional)
        </label>
        <input
          type="text"
          value={value.specific_address || ''}
          onChange={(e) => onChange({
            ...value,
            specific_address: e.target.value
          })}
          placeholder="e.g., Near Accra Mall, House number, landmarks..."
          disabled={disabled}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          } border-gray-300`}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Location Summary */}
      {(value.region || value.city) && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <div className="font-medium">Selected Location:</div>
              <div>
                {selectedRegionInfo?.name}
                {value.city && `, ${value.city}`}
                {value.specific_address && ` - ${value.specific_address}`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;