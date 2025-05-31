import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Star, Home as HomeIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Fishery } from '../../types/schema';

const initialFormState = {
  name: '',
  slug: '',
  description: '',
  rules: '',
  image: '',
  district: '',
  isfeatured: false,
  hasaccommodation: false,
  species: [] as string[],
  features: [] as string[],
  fishing_type: [] as string[],
  facilities: [] as string[],
  booking_type: [] as string[],
  pricing: [] as string[],
  opening_times: [] as string[],
  day_tickets: [] as string[],
  payment: [] as string[],
  website: '',
  contact_phone: '',
  contact_email: '',
  address: '',
  postcode: '',
  day_ticket_price: '',
  night_fishing_allowed: false,
  match_fishing_friendly: false,
  disabled_access: false,
  dog_friendly: false,
  price_range: '',
  fire_pits_allowed: false,
  parking_close: false,
  camping_allowed: false,
  catch_photos: false,
  wifi_signal: '',
  descriptionpage: '',
  fisheryimages1: '',
  fisheryimages2: '',
  fisheryimages3: '',
  fisheryvideo: '',
  bait_boats: false,
  magic_twig: false,
  tackle_shop: false,
  private_hire: false,
  tackle_hire: false,
  coaching: false,
  keepnets_allowed: false,
  tactics: '',
  Latitude: null,
  Longitude: null,
  fishery_of_the_week: false,
  record_biggest_fish: '',
  record_match_weight: '',
  stock: '',
  average_weight: '',
  access_all_hours: false,
  guests_allowed: false,
  under_18: false
};

const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;
  
  // Handle array fields
  if (name === 'species' || name === 'features' || name === 'fishing_type' || 
      name === 'facilities' || name === 'booking_type' || name === 'pricing' || 
      name === 'opening_times' || name === 'day_tickets' || name === 'payment') {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [name]: arrayValue }));
    return;
  }
  
  // Handle boolean fields
  if (type === 'checkbox') {
    setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    return;
  }
  
  // Handle numeric fields
  if (name === 'day_ticket_price' || name === 'Latitude' || name === 'Longitude') {
    const numValue = value === '' ? null : parseFloat(value);
    setFormData(prev => ({ ...prev, [name]: numValue }));
    return;
  }
  
  // Handle all other fields
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  // Generate slug from name if not provided
  const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');
  
  // Prepare data for submission
  const submissionData = {
    ...formData,
    slug,
    // Ensure array fields are properly formatted
    species: Array.isArray(formData.species) ? formData.species : [],
    features: Array.isArray(formData.features) ? formData.features : [],
    fishing_type: Array.isArray(formData.fishing_type) ? formData.fishing_type : [],
    facilities: Array.isArray(formData.facilities) ? formData.facilities : [],
    booking_type: Array.isArray(formData.booking_type) ? formData.booking_type : [],
    pricing: Array.isArray(formData.pricing) ? formData.pricing : [],
    opening_times: Array.isArray(formData.opening_times) ? formData.opening_times : [],
    day_tickets: Array.isArray(formData.day_tickets) ? formData.day_tickets : [],
    payment: Array.isArray(formData.payment) ? formData.payment : []
  };

  try {
    const { data, error } = await supabase
      .from('fisheries')
      .insert([submissionData])
      .select();

    if (error) throw error;

    // Handle successful submission
    console.log('Fishery added successfully:', data);
    setFormData(initialFormState);
    setSuccess('Fishery added successfully');
  } catch (error) {
    console.error('Error:', error);
    setError('Failed to add fishery');
  } finally {
    setLoading(false);
  }
};

export default AdminFisheries;