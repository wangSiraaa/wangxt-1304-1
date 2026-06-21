using BloodMobileApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BloodMobileApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ExternalCollectionPoint> CollectionPoints => Set<ExternalCollectionPoint>();
    public DbSet<BloodDonationAppointment> Appointments => Set<BloodDonationAppointment>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<VehicleInspection> VehicleInspections => Set<VehicleInspection>();
    public DbSet<BloodBag> BloodBags => Set<BloodBag>();
    public DbSet<TempStorageBox> TempStorageBoxes => Set<TempStorageBox>();
    public DbSet<TemperatureRecord> TemperatureRecords => Set<TemperatureRecord>();
    public DbSet<ReturnHandover> ReturnHandovers => Set<ReturnHandover>();
    public DbSet<HandoverDetail> HandoverDetails => Set<HandoverDetail>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ExternalCollectionPoint>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.Property(x => x.Address).IsRequired().HasMaxLength(500);
            e.Property(x => x.Status).HasMaxLength(50);
        });

        modelBuilder.Entity<BloodDonationAppointment>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.DonorName).IsRequired().HasMaxLength(100);
            e.Property(x => x.DonorIdNumber).IsRequired().HasMaxLength(30);
            e.Property(x => x.BloodType).HasMaxLength(10);
            e.Property(x => x.Status).HasMaxLength(50);
            e.HasOne(x => x.CollectionPoint)
                .WithMany()
                .HasForeignKey(x => x.CollectionPointId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Vehicle>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.LicensePlate).IsRequired().HasMaxLength(20);
            e.Property(x => x.Model).HasMaxLength(100);
            e.Property(x => x.Status).HasMaxLength(50);
        });

        modelBuilder.Entity<VehicleInspection>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Status).HasMaxLength(50);
            e.HasOne(x => x.Vehicle)
                .WithMany()
                .HasForeignKey(x => x.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.CollectionPoint)
                .WithMany()
                .HasForeignKey(x => x.CollectionPointId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<BloodBag>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.BagCode).IsRequired().HasMaxLength(50);
            e.Property(x => x.BloodType).HasMaxLength(10);
            e.Property(x => x.BloodProduct).HasMaxLength(50);
            e.Property(x => x.Status).HasMaxLength(50);
            e.HasOne(x => x.CollectionPoint)
                .WithMany()
                .HasForeignKey(x => x.CollectionPointId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.TempStorageBox)
                .WithMany(b => b.BloodBags)
                .HasForeignKey(x => x.TempStorageBoxId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<TempStorageBox>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.BoxCode).IsRequired().HasMaxLength(50);
            e.Property(x => x.Status).HasMaxLength(50);
            e.HasOne(x => x.Vehicle)
                .WithMany()
                .HasForeignKey(x => x.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.CollectionPoint)
                .WithMany()
                .HasForeignKey(x => x.CollectionPointId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TemperatureRecord>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.TempStorageBox)
                .WithMany(b => b.TemperatureRecords)
                .HasForeignKey(x => x.TempStorageBoxId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ReturnHandover>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Status).HasMaxLength(50);
            e.HasOne(x => x.CollectionPoint)
                .WithMany()
                .HasForeignKey(x => x.CollectionPointId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Vehicle)
                .WithMany()
                .HasForeignKey(x => x.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<HandoverDetail>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.ReturnHandover)
                .WithMany(h => h.Details)
                .HasForeignKey(x => x.ReturnHandoverId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.BloodBag)
                .WithMany()
                .HasForeignKey(x => x.BloodBagId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
