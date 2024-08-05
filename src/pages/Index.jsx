import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, ChevronDown, Plus, X, Edit, Trash, Lock, Book, Wrench, DollarSign, Layers } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useDomains, useAddDomain, useUpdateDomain, useDeleteDomain, usePerspectives, useAddPerspective, useDeletePerspective } from '@/integrations/supabase';

const domainTypes = [
  { name: 'Trust', icon: Lock },
  { name: 'Knowledge', icon: Book },
  { name: 'Tools', icon: Wrench },
  { name: 'Exchange', icon: DollarSign },
];

const defaultParticles = {
  Trust: ['Security Protocol', 'Identity Verification', 'Trust Score'],
  Knowledge: ['Learning Path', 'Webinar', 'Information Sharing'],
  Tools: ['Task Management', 'Timeline', 'Resource Allocation'],
  Exchange: ['Payment Processing', 'Service Listing', 'Reviews'],
};

const Index = () => {
  const { data: domains, isLoading: isLoadingDomains, error: domainsError } = useDomains();
  const { data: perspectives, isLoading: isLoadingPerspectives, error: perspectivesError } = usePerspectives();
  const addDomainMutation = useAddDomain();
  const updateDomainMutation = useUpdateDomain();
  const deleteDomainMutation = useDeleteDomain();
  const addPerspectiveMutation = useAddPerspective();
  const deletePerspectiveMutation = useDeletePerspective();
  const { toast } = useToast();

  const [newDomain, setNewDomain] = React.useState({ name: '', type: '' });
  const [newPerspective, setNewPerspective] = React.useState('');
  const [selectedPerspective, setSelectedPerspective] = React.useState('Default');
  const [isAddingDomain, setIsAddingDomain] = React.useState(false);

  const addDomain = async () => {
    if (newDomain.name.trim() !== '' && newDomain.type !== '') {
      try {
        await addDomainMutation.mutateAsync({
          name: newDomain.name.trim(),
          type: newDomain.type,
          perspectives: { Default: {} }
        });
        setNewDomain({ name: '', type: '' });
        toast({ title: "Domain added successfully" });
      } catch (error) {
        toast({ title: "Error adding domain", description: error.message, variant: "destructive" });
      }
    }
  };

  const addPerspective = async () => {
    if (newPerspective.trim() !== '' && !perspectives?.includes(newPerspective.trim())) {
      try {
        await addPerspectiveMutation.mutateAsync({ perspective_name: newPerspective.trim() });
        setNewPerspective('');
        toast({ title: "Perspective added successfully" });
      } catch (error) {
        toast({ title: "Error adding perspective", description: error.message, variant: "destructive" });
      }
    }
  };

  const removePerspective = async (perspective) => {
    if (perspective !== 'Default') {
      try {
        await deletePerspectiveMutation.mutateAsync(perspective);
        if (selectedPerspective === perspective) {
          setSelectedPerspective('Default');
        }
        toast({ title: "Perspective removed successfully" });
      } catch (error) {
        toast({ title: "Error removing perspective", description: error.message, variant: "destructive" });
      }
    }
  };

  if (isLoadingDomains || isLoadingPerspectives) {
    return <div>Loading...</div>;
  }

  if (domainsError || perspectivesError) {
    return <div>Error: {domainsError?.message || perspectivesError?.message}</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">Ontological Domain Navigator</h1>
          <p className="text-xl text-gray-600">Explore and define domains across multiple perspectives</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="mr-2 h-6 w-6" />
                Domains
              </CardTitle>
              <CardDescription>Define and manage your ontological domains</CardDescription>
            </CardHeader>
            <CardContent>
              {isAddingDomain ? (
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter domain name"
                    value={newDomain.name}
                    onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                  />
                  <Select value={newDomain.type} onValueChange={(value) => setNewDomain({ ...newDomain, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain type" />
                    </SelectTrigger>
                    <SelectContent>
                      {domainTypes.map((type) => (
                        <SelectItem key={type.name} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex space-x-2">
                    <Button onClick={addDomain} disabled={addDomainMutation.isPending} className="flex-1">
                      {addDomainMutation.isPending ? 'Adding...' : 'Add Domain'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingDomain(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setIsAddingDomain(true)} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Define New Domain
                </Button>
              )}
              
              {domains?.length === 0 ? (
                <div className="text-center mt-8 p-6 bg-gray-100 rounded-lg">
                  <p className="text-lg text-gray-600">No domains defined yet. Start by defining a new domain above.</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full mt-8">
                  {domains?.map((domain) => {
                    const DomainIcon = domainTypes.find(type => type.name === domain.type)?.icon || Globe;
                    return (
                      <AccordionItem key={domain.id} value={`item-${domain.id}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center w-full">
                            <DomainIcon className="h-6 w-6 mr-2 text-blue-500" />
                            <span className="text-lg font-medium">{domain.name}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p><strong>Type:</strong> {domain.type}</p>
                            <p><strong>Perspective:</strong> {selectedPerspective}</p>
                            <p className="mt-2 font-semibold">Ontological properties:</p>
                            <ul className="list-disc list-inside pl-4">
                              {defaultParticles[domain.type]?.map((particle, index) => (
                                <li key={index}>{particle}</li>
                              ))}
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-6 w-6" />
                  Perspectives
                </CardTitle>
                <CardDescription>Manage ontological perspectives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="New perspective name"
                      value={newPerspective}
                      onChange={(e) => setNewPerspective(e.target.value)}
                      className="flex-grow"
                    />
                    <Button onClick={addPerspective} disabled={addPerspectiveMutation.isPending}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {perspectives?.map((perspective) => (
                      <div key={perspective.perspective_name} className="flex items-center bg-gray-200 rounded-full px-3 py-1">
                        <span>{perspective.perspective_name}</span>
                        {perspective.perspective_name !== 'Default' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 p-0"
                            onClick={() => removePerspective(perspective.perspective_name)}
                            disabled={deletePerspectiveMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Perspective</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedPerspective} onValueChange={setSelectedPerspective}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a perspective" />
                  </SelectTrigger>
                  <SelectContent>
                    {perspectives?.map((perspective) => (
                      <SelectItem key={perspective.perspective_name} value={perspective.perspective_name}>
                        {perspective.perspective_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
