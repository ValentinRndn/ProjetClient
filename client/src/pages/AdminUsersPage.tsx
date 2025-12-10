import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { listUsers, type User, type UsersListResponse } from "@/services/admin";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Users, UserCheck, Building2, Shield } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";

export default function AdminUsersPage() {
  const { user, isLoading: authLoading } = useAuth();

  // Protection supplémentaire : rediriger si pas admin
  if (!authLoading && user && user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  const [usersData, setUsersData] = useState<UsersListResponse>({
    total: 0,
    items: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery, selectedRole]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await listUsers({
        take: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
        q: searchQuery || undefined,
        role: selectedRole !== "all" ? selectedRole : undefined,
      });
      setUsersData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des utilisateurs";
      setError(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-5 h-5 text-red-600" />;
      case "ECOLE":
        return <Building2 className="w-5 h-5 text-blue-600" />;
      case "INTERVENANT":
        return <UserCheck className="w-5 h-5 text-indigo-600" />;
      default:
        return <Users className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: "bg-red-100 text-red-800",
      ECOLE: "bg-blue-100 text-blue-800",
      INTERVENANT: "bg-indigo-100 text-indigo-800",
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
          styles[role as keyof typeof styles] || "bg-gray-100 text-gray-800"
        }`}
      >
        {getRoleIcon(role)}
        {role}
      </span>
    );
  };

  const totalPages = Math.ceil(usersData.total / itemsPerPage);

  // Protection supplémentaire : rediriger si pas admin
  if (!authLoading && user && user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // Afficher un loader pendant la vérification d'authentification
  if (authLoading) {
    return (
      <PageContainer maxWidth="7xl" className="py-8">
        <div className="text-center py-12">
          <div className="text-gray-500">Vérification des permissions...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="7xl" className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Utilisateurs
        </h1>
        <p className="text-gray-600">
          Consultez et gérez tous les utilisateurs de la plateforme
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </div>
      )}

      {/* Filtres et recherche */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher par email ou nom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">Tous les rôles</option>
            <option value="ADMIN">Admin</option>
            <option value="ECOLE">École</option>
            <option value="INTERVENANT">Intervenant</option>
          </Select>
          <Button
            variant="primary"
            onClick={handleSearch}
            className="w-full md:w-auto"
          >
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
        </div>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {usersData.total}
              </p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-red-600">
                {usersData.items.filter((u) => u.role === "ADMIN").length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-red-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Écoles</p>
              <p className="text-2xl font-bold text-blue-600">
                {usersData.items.filter((u) => u.role === "ECOLE").length}
              </p>
            </div>
            <Building2 className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Intervenants</p>
              <p className="text-2xl font-bold text-indigo-600">
                {usersData.items.filter((u) => u.role === "INTERVENANT").length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-indigo-400" />
          </div>
        </Card>
      </div>

      {/* Liste des utilisateurs */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Chargement des utilisateurs...</div>
        </div>
      ) : usersData.items.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Aucun utilisateur trouvé.</p>
        </Card>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {usersData.items.map((user) => (
              <Card key={user.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.email}
                        </h3>
                        {getRoleBadge(user.role)}
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Inscrit le{" "}
                        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
