-- Remove demo clients from the clients table
DELETE FROM public.clients 
WHERE email IN (
    'john@acme.com',
    'jane@techsolutions.com', 
    'bob@startupxyz.com'
);