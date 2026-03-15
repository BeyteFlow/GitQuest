using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Quests_UserId",
                table: "Quests");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Quests",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Quests_UserId_GitHubIssueId_ActiveStatus",
                table: "Quests",
                columns: new[] { "UserId", "GitHubIssueId", "Status" },
                unique: true,
                filter: "[Status] = 'In Progress'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Quests_UserId_GitHubIssueId_ActiveStatus",
                table: "Quests");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Quests",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_Quests_UserId",
                table: "Quests",
                column: "UserId");
        }
    }
}
