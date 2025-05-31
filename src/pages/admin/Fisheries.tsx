@@ .. @@
 const handleInputChange = (
   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
 ) => {
   const { name, value, type } = e.target;
 
   // Handle array fields (comma-separated values)
   const arrayFields = [
     'species',
     'features',
     'fishing_type',
     'facilities',
     'booking_type',
     'pricing',
     'opening_times',
     'day_tickets',
     'payment',
   ];
 
-  if (arrayFields.includes(name)) {
+  // Convert comma-separated string to array, handling empty values
+  if (arrayFields.includes(name)) { 
+    const arrayValue = value.trim() === '' ? [] : value.split(',').map(item => item.trim()).filter(Boolean);
     setFormData(prev => ({
       ...prev,
-      [name]: value.split(',').map(item => item.trim()).filter(Boolean),
+      [name]: arrayValue,
     }));
     return;
   }
 
   // Handle boolean fields
   if (type === 'checkbox') {
     setFormData(prev => ({
       ...prev,
       [name]: (e.target as HTMLInputElement).checked,
     }));
     return;
   }
 
   // Handle numeric fields
   if (name === 'day_ticket_price' || name === 'Latitude' || name === 'Longitude') {
-    const numValue = value === '' ? null : parseFloat(value);
+    // Handle empty string as null, otherwise parse as float
+    const numValue = value.trim() === '' ? null : parseFloat(value);
     setFormData(prev => ({
       ...prev,
       [name]: numValue,
     }));
     return;
   }
 
   // Handle all other fields
   setFormData(prev => ({
     ...prev,
-    [name]: value,
+    [name]: value.trim() === '' ? null : value,
   }));
 };
 
 // Handle form submission
 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setLoading(true);
   setError(null);
 
   try {
     // Generate slug from name if not provided
     const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');
 
     // Prepare data for submission
     const submissionData = {
       ...formData,
       slug,
+      // Ensure array fields are properly formatted
+      species: Array.isArray(formData.species) ? formData.species : [],
+      features: Array.isArray(formData.features) ? formData.features : [],
+      fishing_type: Array.isArray(formData.fishing_type) ? formData.fishing_type : [],
+      facilities: Array.isArray(formData.facilities) ? formData.facilities : [],
+      booking_type: Array.isArray(formData.booking_type) ? formData.booking_type : [],
+      pricing: Array.isArray(formData.pricing) ? formData.pricing : [],
+      opening_times: Array.isArray(formData.opening_times) ? formData.opening_times : [],
+      day_tickets: Array.isArray(formData.day_tickets) ? formData.day_tickets : [],
+      payment: Array.isArray(formData.payment) ? formData.payment : [],
     };
 
     // Insert or update based on whether we're adding or editing
     const { data, error } = isEditModalOpen
       ? await supabase
           .from('fisheries')
           .update(submissionData)
           .eq('id', currentFishery?.id)
           .select()
       : await supabase
           .from('fisheries')
           .insert([submissionData])
           .select();
 
     if (error) throw error;
 
     // Update local state
     if (isEditModalOpen) {
       setFisheries(fisheries.map(f => 
         f.id === currentFishery?.id ? data[0] : f
       ));
     } else {
       setFisheries([data[0], ...fisheries]);
     }
 
     // Reset form and close modal
     setFormData(initialFormState);
     setIsAddModalOpen(false);
     setIsEditModalOpen(false);
     setCurrentFishery(null);
   } catch (err: any) {
     setError(err.message);
   } finally {
     setLoading(false);
   }
 };
@@ .. @@